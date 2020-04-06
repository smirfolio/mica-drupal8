/*
 * Copyright (c) 2018 OBiBa. All rights reserved.
 *
 * This program and the accompanying materials
 * are made available under the terms of the GNU Public License v3.0.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


mica.ObibaLists = angular.module('mica.lists', [
  'obiba.mica.lists'
])
  .run(function(){
    console.log('Im in list');
  })
  .config(['ngObibaMicaSearchProvider', 'markedProvider', 'sortWidgetOptionsProvider', 'ngObibaMicaSearchTemplateUrlProvider',
    function (ngObibaMicaSearchProvider, markedProvider, sortWidgetOptionsProvider, ngObibaMicaSearchTemplateUrlProvider) {
    if(drupalSettings.obibaListOptions){
      sortWidgetOptionsProvider.setOptions(drupalSettings.obibaListOptions);
    }
      console.log('Im in list');
    markedProvider.setOptions({
      gfm: true,
      tables: true,
      sanitize: false
    });
    if(drupalSettings.obibaListOptions.studyOptions){
      drupalSettings.obibaListSearchOptions.studies.obibaListOptions = drupalSettings.obibaListOptions.studyOptions;
    }
    if(drupalSettings.obibaListOptions.networkOptions){
      drupalSettings.obibaListSearchOptions.networks.obibaListOptions = drupalSettings.obibaListOptions.networkOptions;
    }
    if(drupalSettings.obibaListOptions.datasetOptions){
      drupalSettings.obibaListSearchOptions.datasets.obibaListOptions = drupalSettings.obibaListOptions.datasetOptions;
    }
    drupalSettings.obibaListSearchOptions.listLayout = 'layout1';
    ngObibaMicaSearchProvider.initialize(drupalSettings.obibaListSearchOptions);
    if(drupalSettings.listOverrideThemes){
      angular.forEach(drupalSettings.listOverrideThemes, function (template, keyTemplate) {
        ngObibaMicaSearchTemplateUrlProvider.setTemplateUrl(keyTemplate, drupalSettings.basePath + 'obiba_mica_app_angular_view_template/' + template);
      })
    }
  }])
  .filter('getBaseUrl', function () {
    return function (param) {
      return drupalSettings.basePath + drupalSettings.pathPrefix + 'mica/' + param;
    }
  }).filter('doSearchQuery', function () {
    return function (type, query) {
      return drupalSettings.basePath + drupalSettings.pathPrefix + 'mica/repository#/search?type=' + type + '&query=' + query + '&display=list'
    }
  })
  .filter('getLabel', function () {
    return function (SelectSort, valueSort) {
      var result = null;
      angular.forEach(SelectSort.options, function (value, key) {
        if (value.value.indexOf(valueSort) !== -1) {
          result = value.label;
        }
      });
      return result;
    }
  });
