<?php
/**
 * @file
 * Contains \Drupal\obiba_mica_angular_app\Controller\AngularAppController
 */

namespace  Drupal\obiba_mica_angular_app\Controller;

use Drupal\Core\Controller\ControllerBase;

class AngularAppController extends ControllerBase{

  public  function page($jsOptions = [], $library = ''){
    $drupalSettings = [
      'drupalSettings' => [
        'angularApp' => [
          'basicAth' => base64_encode('anonymous:password'),
        ],
     ]
    ];
    if(!empty($jsOptions)){
      $drupalSettings = array_merge($drupalSettings['drupalSettings'], $jsOptions);
    }
    return [
      '#theme' => 'obiba-mica-angular-app',
      '#module_caller' => 'obiba_mica_repository',

      '#attached' => [
          'library' => [
            'obiba_mica_angular_app/angular-app',
            'obiba_mica_angular_app/obiba_mica_angular_app',
            $library
          ],
        'drupalSettings' => $drupalSettings,
      ],
    ];
  }

    public function getTheme($themeKey ){
    //  https://drupal.stackexchange.com/questions/137633/returning-html-through-an-ajax-call-in-drupal-8
      $twig = \Drupal::service('twig');
      $template = $twig->loadTemplate(drupal_get_path('module', 'obiba_mica_angular_app') . '/js/search/views/' . $themeKey . '.html.twig');
      echo $template->render([
        'locale_language' => \Drupal::languageManager()->getCurrentLanguage()->getId()
      ]);
      die;
  }

}