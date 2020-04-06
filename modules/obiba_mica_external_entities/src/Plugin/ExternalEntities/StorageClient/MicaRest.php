<?php

/**
 * @file
 * Contains \Drupal\mica_external_entities\Plugin\ExternalEntityStorageClient\MicaRest.
 */

namespace Drupal\obiba_mica_external_entities\Plugin\ExternalEntities\StorageClient;


use Drupal\external_entities\StorageClient\ExternalEntityStorageClientBase;
use Drupal\Core\Plugin\PluginFormInterface;
//use Drupal\external_entities\Plugin\PluginFormTrait;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\external_entities\ResponseDecoder\ResponseDecoderFactoryInterface;
use GuzzleHttp\ClientInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\external_entities\ExternalEntityInterface;
use Drupal\Core\Form\FormStateInterface;


/**
 * External entities storage client based on a REST API.
 *
 * @ExternalEntityStorageClient(
 *   id = "mica_rest",
 *   label = @Translation("MICAREST"),
 *   description = @Translation("Retrieves Mica external entities from a REST API.")
 * )
 */
class MicaRest extends ExternalEntityStorageClientBase implements PluginFormInterface {

  /**
   * The HTTP client to fetch the files with.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected $httpClient;

  /**
   * @var \Psr\Log\LoggerInterface
   */
//  private $logger;

  /**
   * Constructs a Mica Rest object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $string_translation
   *   The string translation service.
   * @param \Drupal\external_entities\ResponseDecoder\ResponseDecoderFactoryInterface $response_decoder_factory
   *   The response decoder factory service.
   * @param \GuzzleHttp\ClientInterface $http_client
   *   A Guzzle client object.
   *
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, TranslationInterface $string_translation, ResponseDecoderFactoryInterface $response_decoder_factory, ClientInterface $http_client) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $string_translation, $response_decoder_factory);
//    $this->configuration = $configuration;
    $this->httpClient = $http_client;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('string_translation'),
      $container->get('external_entities.response_decoder_factory'),
      $container->get('http_client')
    );
  }


  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'mica_endpoint' => NULL,
      'list_path' => NULL,
      'document_path' => NULL,
      'response_format' => NULL,
      'basic_authentication' => [
        'anonymous_login' => NULL,
        'anonymous_password' => NULL,
      ]
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {

    $form['mica_endpoint'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Mica End point'),
      '#required' => TRUE,
      '#default_value' => $this->configuration['mica_endpoint'],
    ];

    $form['list_path'] = [
      '#type' => 'textfield',
      '#title' => $this->t('List path (studies, networks, etc ...)'),
      '#required' => TRUE,
      '#default_value' => $this->configuration['list_path'],
    ];

    $form['document_path'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Document Path (individual-studies, networks, etc ...)'),
      '#required' => TRUE,
      '#default_value' => $this->configuration['document_path'],
    ];

    $formats = $this->responseDecoderFactory->supportedFormats();
    $form['response_format'] = [
      '#type' => 'select',
      '#title' => $this->t('Response format'),
      '#options' => array_combine($formats, $formats),
      '#required' => TRUE,
      '#default_value' => $this->configuration['response_format'],
    ];

    $form['basic_authentication'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Basic Authentication Anonymous user'),
    ];
    $form['basic_authentication']['anonymous_login'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Anonymous user name'),
      '#required' => TRUE,
      '#default_value' => $this->configuration['basic_authentication']['anonymous_login'],
    ];

    $form['basic_authentication']['anonymous_password'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Anonymous user password'),
      '#required' => TRUE,
      '#default_value' => $this->configuration['basic_authentication']['anonymous_password'],
    ];


    return $form;
  }

  /**
   * Helper function to convert a parameter collection to a string.
   *
   * @param string $type
   *   The type of parameters (eg. 'list' or 'single').
   *
   * @return string|null
   *   A string to be used as default value, or NULL if no parameters.
   */
  protected function getParametersFormDefaultValue($type) {
    $default_value = NULL;

    if (!empty($this->configuration['parameters'][$type])) {
      $lines = [];
      foreach ($this->configuration['parameters'][$type] as $key => $value) {
        $array = array_unique([$key, $value]);
        $lines[] = implode('|', $array);
      }
      $default_value = implode("\n", $lines);
    }

    return $default_value;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    $form_state->setValue('mica_endpoint', rtrim($form_state->getValue('mica_endpoint'), '/'));
    $form_state->setValue('list_path', rtrim($form_state->getValue('list_path'), '/'));
    $form_state->setValue('document_path', rtrim($form_state->getValue('document_path'), '/'));
    $this->setConfiguration($form_state->getValues());
  }
  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
  }

  /**
   * {@inheritdoc}
   */
  public function load($id) {
    $response = $this->MicaRestExecuteQuery($id);
    $body = $response->getBody();
    return $this
      ->getResponseDecoderFactory()
      ->getDecoder($this->configuration['response_format'])
      ->decode($body);
  }

  /**
   * {@inheritdoc}
   */
  public  function loadMultiple(array $ids = NULL){
    $data = [];

    if (!empty($ids) && is_array($ids)) {
      foreach ($ids as $id) {
        $data[$id] = $this->load($id);
      }
    }

    return $data;

  }

  /**
   * {@inheritdoc}
   */
  public  function save(ExternalEntityInterface $entity){

  }

  /**
   * {@inheritdoc}
   */
  public  function delete(ExternalEntityInterface $entity){

  }

  /**
   * {@inheritdoc}
   */
  public function query(array $parameters = [], array $sorts = [], $start = NULL, $length = NULL) {
    $headers = $this->getHttpHeaders();
    $calssName = '';
    $headers['Authorization'] = 'Basic ' .
      base64_encode($this->configuration['basic_authentication']['anonymous_login'] .
        ':' .
        $this->configuration['basic_authentication']['anonymous_password']);
    $headers['Content-Type'] = 'application/x-www-form-urlencoded';

    switch ($this->configuration['document_path']){
      case 'harmonization-study':
        $calssName = 'HarmonizationStudy';
        break;
      case 'individual-study':
        $calssName = 'Study';
        break;
      default:
        $calssName = $this->configuration['list_path'];
    }
    $response = $this->httpClient->request(
      'POST',
      $this->configuration['mica_endpoint'] . '/' . $this->configuration['list_path'] . '/_rql',
      [
        'form_params' => [
              'query' => 'study(in(Mica_study.className,' . $calssName . '),sort(name),limit(0,20),fields((logo,objectives.*,acronym.*,name.*,model.methods.design,model.numberOfParticipants.participant))),locale(en)',
        ],
        'headers' => $headers,
        'decode_content' => false,
      ]
    );


    $body = $response->getBody() . '';

    $studies = json_decode($body)->studyResultDto->{'obiba.mica.StudyResultDto.result'}->summaries;
    $results = $this
      ->getResponseDecoderFactory()
      ->getDecoder($this->configuration['response_format'])
      ->decode(json_encode($studies));

    return $results;
  }

  /**
   * {@inheritdoc}
   */
  public  function countQuery(array $parameters = []){

  }
  /**
   * Gets the HTTP headers to add to a request.
   *
   * @return array
   *   Associative array of headers to add to the request.
   */
  public function getHttpHeaders() {
    $headers = [];
    if(!empty($this->configuration['response_format'])){
      $headers['Accept'] = 'Application/' . $this->configuration['response_format'];
    }
    if (!empty($this->configuration['api_key']) && ($this->configuration['api_key']['header_name'] && $this->configuration['api_key']['key'])) {
      $headers[$this->configuration['api_key']['header_name']] = $this->configuration['api_key']['key'];
    }
    return $headers;
  }

  /**
   * @param string $query
   *
   * @return \GuzzleHttp\Psr7\Response
   */
  protected function MicaRestExecuteQuery($id) {
    $headers = $this->getHttpHeaders();
    $headers['Authorization'] = 'Basic ' .
      base64_encode($this->configuration['basic_authentication']['anonymous_login'] .
        ':' .
        $this->configuration['basic_authentication']['anonymous_password']);
    $response = $this->httpClient->get(
      $this->configuration['mica_endpoint'] . '/' . $this->configuration['document_path'] . '/' . $id,
      [
        'headers' => $headers,
        'query' => [
        ]
      ]
    );
    return $response;
  }

}
