<?php
/**
 * Created by IntelliJ IDEA.
 * User: samir
 * Date: 20/11/19
 * Time: 2:48 PM
 */

namespace Drupal\obiba_mica_angular_app\Controller;


class ListController extends AngularAppController {
  CONST ANGULAR_LIST_HARMONIZATION_STUDIES = '/mica/study/harmonization-study';
  CONST ANGULAR_LIST_INDIVIDUAL_STUDIES = '/mica/study/individual-study';
  private $currentPath;



  public function __construct() {
    $this->currentPath = \Drupal::service('path.current')->getPath();;
  }

  public  function studyList(){
    return $this->page($this->listOptions(), 'obiba_mica_angular_app/obiba_mica_list');
  }

  private function listOptions() {
    $resultTabsOrder = NULL;
    $targetTabsOrder = NULL;
    $listOptions = NULL;
    $obibaListSearchOptions = [
      'datasetTaxonomiesOrder' => [],
      'studyTaxonomiesOrder' => [],
      'networkTaxonomiesOrder' => [],
      'variableTaxonomiesOrder' => [],
      'searchTabsOrder' => ['list'],
      'showSearchBox' => 0,
      'showSearchBrowser' => 0,
      'variables' => ['showSearchTab'],
      'showAllFacetedTaxonomies' => FALSE
    ];
    if ($this->currentPath === ListController::ANGULAR_LIST_INDIVIDUAL_STUDIES) {
      $obibaListSearchOptions['studyTaxonomiesOrder'] = ['Mica_study'];
    }
    $listOptions = $this->studiesOptions();
    $obibaListSearchOptions['resultTabsOrder'] = array('study');
    $obibaListSearchOptions['targetTabsOrder'] = array('study');
    if (!empty($listOptions['listSearchOptions']['study'])) {
      $obibaListSearchOptions['studies'] = $listOptions['listSearchOptions']['study'];
    }

    $obibaListOptions = $listOptions;
    $listOverrideThemes = [];

    // List template override capability :
    //    $listOverrideThemes =  obiba_mica_commons_enabled_theme(array(
    //    'searchStudiesResultTable' => 'studies-search-result-table-template',
    //    'searchNetworksResultTable' => 'networks-search-result-table-template',
    //    'searchDatasetsResultTable' => 'datasets-search-result-table-template',
    //    'searchResultList' => 'search-result-list-template',
    //    'searchInputList' => 'input-search-widget-template',
    //  ));
    return $listJsOption = [
      'angularModule' => 'mica.lists',
      'obibaListOptions' => $obibaListOptions['listOptions'],
      'obibaListSearchOptions' => $obibaListSearchOptions,
      'listOverrideThemes' => !empty($listOverrideThemes) ? $listOverrideThemes : NULL,
    ];
  }

  private function studiesOptions() {
    $acronymNameSort = 'name';
    $studiesOptions = array(
      'listSearchOptions' => array(
        'study' => array(
          'fields' => array(
            "logo",
            "objectives.*",
            "acronym.*",
            "name.*",
            "model.methods.design",
            "model.numberOfParticipants.participant"
          ),
        )
      ),
      'listOptions' => array(
        'studyOptions' => array(
          'studiesCountCaption' => TRUE,
          'studiesSearchForm' => TRUE,
          'studiesSupplInfoDetails' => TRUE,
          'studiesTrimmedDescription' =>TRUE,
          'showNetworkBadge' => array(
            'showTab' =>TRUE,
            'showBadge' => TRUE,
          ),
          'showDatasetBadge' => array(
            'showTab' => TRUE,
            'showBadge' => TRUE,
          ),
          'showVariableBadge' => array(
            'showTab' => TRUE,
            'showBadge' => TRUE,
          ),
        ),
        'sortOrderField' => array(
          'options' => array(
            array(
              'value' => 'numberOfParticipants-participant-number',
              'label' => 'study_taxonomy.vocabulary.numberOfParticipants-participant-number.title'
            ),
            array(
              'value' => '-numberOfParticipants-participant-number',
              'label' => 'study_taxonomy.vocabulary.numberOfParticipants-participant-number.title'
            )
          ),
          'defaultValue' => $acronymNameSort,
        )
      ),
    );
    if($this->currentPath === ListController::ANGULAR_LIST_HARMONIZATION_STUDIES){
      unset($studiesOptions['listOptions']['sortOrderField']['options'][0]);
      unset($studiesOptions['listOptions']['sortOrderField']['options'][1]);
      $studiesOptions['listOptions']['sortOrderField']['defaultValue'] = $acronymNameSort !== 'numberOfParticipants-participant-number' ? $studiesOptions : 'name';
      $studiesOptions['listOptions']['studyOptions'] = array(
        'studiesCountCaption' => TRUE,
        'studiesSearchForm' => TRUE,
        'studiesSupplInfoDetails' =>TRUE,
        'studiesTrimmedDescription' => TRUE,
        'showNetworkBadge' => array(
          'showTab' => TRUE,
          'showBadge' => TRUE,
        ),
        'showDatasetBadge' => array(
          'showTab' => TRUE,
          'showBadge' => TRUE,
          'showVariableBadge' => array(
            'showTab' => TRUE,
            'showBadge' => TRUE,
          ),
        )
      );
    }
    return $studiesOptions;
  }
}