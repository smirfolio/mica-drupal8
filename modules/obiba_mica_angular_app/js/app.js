/*
 * Copyright (c) 2018 OBiBa. All rights reserved.
 *
 * This program and the accompanying materials
 * are made available under the terms of the GNU Public License v3.0.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

/* App Module */


var registry = {
  'DataAccessClientDetailPath': '',
  'DataAccessClientListPath': '',
  'DataAccessFormConfigResource': 'ws/config/data-access-form',
  'DataAccessAmendmentFormConfigResource': 'ws/config/data-access-amendment-form',
  'DataAccessRequestsResource': 'ws/data-access-requests',
  'DataAccessAmendmentsResource': 'ws/data-access-request/:parentId/amendments',
  'DataAccessAmendmentResource': 'ws/data-access-request/:parentId/amendment/:id',
  'DataAccessRequestsExportHistoryResource': 'ws/data-access-requests/_history?lang=:lang',
  'DataAccessRequestsExportCsvResource': 'ws/data-access-requests/csv?lang=:lang',
  'DataAccessRequestResource': 'ws/data-access-request/:id',
  'DataAccessRequestActionLogsResource': 'ws/data-access-request/:id/_log-actions',
  'DataAccessAmendmentsLogHistoryResource': 'ws/data-access-request/:id/amendments/_history',
  'DataAccessRequestAttachmentsUpdateResource': 'ws/data-access-request/:id/_attachments',
  'DataAccessRequestAttachmentDownloadResource': 'ws/data-access-request/:id/attachments/:attachmentId/_download',
  'SchemaFormAttachmentDownloadResource': '/ws/:path/form/attachments/:attachmentName/:attachmentId/_download',
  'DataAccessRequestDownloadPdfResource': '/ws/data-access-request/:id/_pdf',
  'DataAccessRequestCommentsResource': 'ws/data-access-request/:id/comments?admin=:admin',
  'DataAccessRequestCommentResource': 'ws/data-access-request/:id/comment/:commentId',
  'DataAccessRequestStatusResource': 'ws/data-access-request/:id/_status?to=:status',
  'DataAccessAmendmentStatusResource': 'ws/data-access-request/:parentId/amendment/:id/_status?to=:status',
  'TempFileUploadResource': 'ws/files/temp',
  'TempFileResource': 'ws/files/temp/:id',
  'TaxonomiesSearchResource': 'ws/taxonomies/_search',
  'TaxonomiesResource': 'ws/taxonomies/_filter',
  'TaxonomyResource': 'ws/taxonomy/:taxonomy/_filter',
  'VocabularyResource': 'ws/taxonomy/:taxonomy/vocabulary/:vocabulary/_filter',
  'VariableResource': 'ws/variable/:id',
  'VariableSummaryResource': 'ws/variable/:id/summary',
  'CartPage': '#/cart',
  'SetsPage': '#/sets',
  'SetsResource': 'ws/:type/sets',
  'SetsImportResource': 'ws/:type/sets/_import',
  'SetResource': 'ws/:type/set/:id',
  'SetClearResource': 'ws/:type/set/:id/documents',
  'SetDocumentsResource': 'ws/:type/set/:id/documents?from=:from&limit=:limit',
  'SetExistsResource': 'ws/:type/set/:id/document/:did/_exists',
  'SetImportResource': 'ws/:type/set/:id/documents/_import',
  'SetImportQueryResource': 'ws/:type/set/:id/documents/_rql',
  'SetRemoveResource': 'ws/:type/set/:id/documents/_delete',
  'SetOpalExportResource': 'ws/:type/set/:id/documents/_opal',
  'JoinQuerySearchResource': 'ws/:type/_rql',
  'JoinQuerySearchCsvResource': 'ws/:type/_rql_csv?query=:query',
  'JoinQuerySearchCsvReportResource': 'ws/:type/_report?query=:query',
  'JoinQuerySearchCsvReportByNetworkResource': 'ws/:type/_report_by_network?networkId=:networkId&locale=:locale',
  'JoinQueryCoverageResource': 'ws/variables/_coverage',
  'JoinQueryCoverageDownloadResource': 'ws/variables/_coverage_download?query=:query',
  'VariablePage': '',
  'NetworkPage': '#/network/:network',
  'StudyPage': '#/:type/:study',
  'StudyPopulationsPage': '#/:type/:study',
  'StudyDcePage': '#/:type/:study/dce-id-:dce',
  'DatasetPage': '#/:type/:dataset',
  'BaseUrl': '',
  'FileBrowserFileResource': 'ws/file/:path/',
  'FileBrowserSearchResource': 'ws/files-search/:path',
  'FileBrowserDownloadUrl': 'ws/draft/file-dl/:path?inline=:inline',
  'SearchBaseUrl': '#/search',
  'DocumentSuggestion': 'ws/:documentType/_suggest',
  'EntitiesCountResource': 'ws/datasets/entities/_count?query=:query',
  'EntitiesCountBaseUrl': '#/entities-count',
  'DatasetCategoricalVariablesResource': 'ws/:dsType/:dsId/variables/:query/categorical',
  'DatasetVariablesResource': 'ws/:dsType/:dsId/variables/:query',
  'DatasetVariableResource': 'ws/variable/:varId',
  'DatasetVariablesCrosstabResource': 'ws/:dsType/:dsId/variables/cross/:v1/by/:v2',
  'DatasetResource': 'ws/dataset/:dsType/:dsId',
};

var modules = [
  'http-auth-interceptor',
  'ngCookies',
  'ngResource',
  'ngObiba',
  'ngRoute',
  'ngObibaMica',
  'hc.marked',
  'mica.configNg'
];

var sanitizeModules = function (origArr) {
  if (!Array.isArray(origArr)) {
    var res = [];
    for (var i in origArr) {
      res.push(origArr[i]);
    }
    origArr = res;
  }

  var newArr = [],
    origLen = origArr.length,
    found, x, y;

  for (x = 0; x < origLen; x ++) {
    found = undefined;
    for (y = 0; y < newArr.length; y ++) {
      if (origArr[x] === newArr[y]) {
        found = true;
        break;
      }
    }
    if (! found && origArr[x] !== false) {
      newArr.push(origArr[x]);
    }
  }
  return newArr;
};
//var drupalModules = sanitizeModules(drupalSettings.angularModule);
/* App Module */
if (drupalSettings.angularModule) {
  modules = modules.concat(drupalSettings.angularModule);
}

console.log(drupalSettings);
console.log(modules);
var mica = angular.module('mica', modules);

mica.config(['ngObibaMicaSearchProvider', 'ngObibaMicaUrlProvider',
  function (ngObibaMicaSearchProvider, ngObibaMicaUrlProvider) {
    var basePathAndPathPrefix =  "http://localhost/";
    console.log(basePathAndPathPrefix + registry['TaxonomiesSearchResource']);
    //
    // ngObibaMicaUrlProvider.setUrl('DataAccessClientDetailPath', 'mica/data_access/request');
    // ngObibaMicaUrlProvider.setUrl('DataAccessClientListPath',  'mica/data_access/requests');
    // ngObibaMicaUrlProvider.setUrl('DataAccessFormConfigResource', basePathAndPathPrefix + 'mica/data_access/data-access-form/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessAmendmentFormConfigResource', basePathAndPathPrefix + 'mica/data_access/data-access-amendment-form/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestsExportHistoryResource', Drupal.settings.basePath + 'mica/data_access/requests/_history/ws' + ((Drupal.settings.basePath.indexOf('?q=')!==-1)?'&':'?') + 'lang=:lang');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestsExportCsvResource', Drupal.settings.basePath + 'mica/data_access/requests/csv/ws' + ((Drupal.settings.basePath.indexOf('?q=')!==-1)?'&':'?') + 'lang=:lang');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestsResource', basePathAndPathPrefix + 'mica/data_access/requests/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessAmendmentsResource', Drupal.settings.basePath + 'mica/data_access/request/:parentId/amendments/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestResource', basePathAndPathPrefix + 'mica/data_access/request/:id/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestActionLogsResource', basePathAndPathPrefix + 'mica/data_access/request/:id/_log-actions/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessAmendmentsLogHistoryResource', basePathAndPathPrefix + 'mica/data_access/request/:id/amendments/_history/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessAmendmentResource', basePathAndPathPrefix + 'mica/data_access/request/:parentId/amendment/:id/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestAttachmentsUpdateResource', basePathAndPathPrefix + 'mica/data_access/request/:id/_attachments/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestAttachmentDownloadResource', basePathAndPathPrefix + 'mica/data_access/request/:id/attachments/:attachmentId/_download/ws');
    // ngObibaMicaUrlProvider.setUrl('SchemaFormAttachmentDownloadResource', basePathAndPathPrefix + 'mica/data_access/request/form/attachments/:attachmentName/:attachmentId/_download/ws' + ((Drupal.settings.basePath.indexOf('?q=')!==-1)?'&':'?') + 'path=:path');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestDownloadPdfResource', basePathAndPathPrefix + 'mica/data_access/request/:id/_pdf/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestCommentsResource', basePathAndPathPrefix + 'mica/data_access/request/:id/comments/ws?admin=:admin');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestCommentResource', basePathAndPathPrefix + 'mica/data_access/request/:id/comment/:commentId/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessRequestStatusResource', basePathAndPathPrefix + 'mica/data_access/request/:id/_status/:status/ws');
    // ngObibaMicaUrlProvider.setUrl('DataAccessAmendmentStatusResource', basePathAndPathPrefix + 'mica/data_access/request/:parentId/amendment/:id/_status/:status/ws');
    // ngObibaMicaUrlProvider.setUrl('TempFileUploadResource', basePathAndPathPrefix + 'mica/data_access/request/upload-file');
    // ngObibaMicaUrlProvider.setUrl('TempFileResource', basePathAndPathPrefix + 'mica/data_access/request/file/:id');
    ngObibaMicaUrlProvider.setUrl('TaxonomiesSearchResource', basePathAndPathPrefix + registry['TaxonomiesSearchResource']);
    ngObibaMicaUrlProvider.setUrl('TaxonomiesResource', basePathAndPathPrefix + registry['TaxonomiesResource']);
    ngObibaMicaUrlProvider.setUrl('TaxonomyResource', basePathAndPathPrefix + registry['TaxonomyResource']);
    ngObibaMicaUrlProvider.setUrl('VocabularyResource', basePathAndPathPrefix + registry['VocabularyResource']);
    ngObibaMicaUrlProvider.setUrl('VariableResource', basePathAndPathPrefix + registry['VariableResource']);
    ngObibaMicaUrlProvider.setUrl('VariableSummaryResource', basePathAndPathPrefix + registry['VariableSummaryResource']);
    // ngObibaMicaUrlProvider.setUrl('CartPage', basePathAndPathPrefix + 'mica/cart#/cart');
    // ngObibaMicaUrlProvider.setUrl('SetsPage', basePathAndPathPrefix + 'mica/sets#/sets');
    // ngObibaMicaUrlProvider.setUrl('SetsResource', basePathAndPathPrefix + 'mica/sets/:type/sets/ws');
    // ngObibaMicaUrlProvider.setUrl('SetsImportResource', basePathAndPathPrefix + 'mica/sets/:type/sets/_import/ws');
    // ngObibaMicaUrlProvider.setUrl('SetResource', basePathAndPathPrefix + 'mica/sets/:type/set/:id/ws');
    // ngObibaMicaUrlProvider.setUrl('SetOpalExportResource', basePathAndPathPrefix + 'mica/sets/:type/set/:id/documents/_opal/ws');
    // ngObibaMicaUrlProvider.setUrl('SetDocumentsResource', basePathAndPathPrefix + 'mica/sets/:type/set/:id/documents/:from/:limit/ws');
    // ngObibaMicaUrlProvider.setUrl('SetClearResource', basePathAndPathPrefix + 'mica/sets/:type/set/:id/documents/ws');
    // ngObibaMicaUrlProvider.setUrl('SetExistsResource', basePathAndPathPrefix + 'mica/sets/:type/set/:id/document/:did/_exists/ws');
    // ngObibaMicaUrlProvider.setUrl('SetImportResource', basePathAndPathPrefix + 'mica/sets/:type/set/:id/documents/_import/ws');
    // ngObibaMicaUrlProvider.setUrl('SetImportQueryResource', basePathAndPathPrefix + 'mica/sets/:type/set/:id/documents/_rql/ws');
    // ngObibaMicaUrlProvider.setUrl('SetRemoveResource', basePathAndPathPrefix + 'mica/sets/:type/set/:id/documents/_delete/ws');
    ngObibaMicaUrlProvider.setUrl('JoinQuerySearchResource', basePathAndPathPrefix + registry['JoinQuerySearchResource']);
    ngObibaMicaUrlProvider.setUrl('JoinQuerySearchCsvResource', basePathAndPathPrefix + registry['JoinQuerySearchCsvResource']);
    ngObibaMicaUrlProvider.setUrl('JoinQuerySearchCsvReportResource', basePathAndPathPrefix + registry['JoinQuerySearchCsvReportResource']);
    ngObibaMicaUrlProvider.setUrl('JoinQuerySearchCsvReportByNetworkResource', basePathAndPathPrefix +  registry['JoinQuerySearchCsvReportByNetworkResource']);
    ngObibaMicaUrlProvider.setUrl('JoinQueryCoverageResource', basePathAndPathPrefix + registry['JoinQueryCoverageResource']);
    ngObibaMicaUrlProvider.setUrl('JoinQueryCoverageDownloadResource',  basePathAndPathPrefix + registry['JoinQueryCoverageDownloadResource']);
    // ngObibaMicaUrlProvider.setUrl('VariablePage', basePathAndPathPrefix + 'mica/variable/:variable');
    // ngObibaMicaUrlProvider.setUrl('NetworkPage', basePathAndPathPrefix + 'mica/network/:network');
    ngObibaMicaUrlProvider.setUrl('StudyPage', '/drupal8/:type/:study');
    // ngObibaMicaUrlProvider.setUrl('StudyPopulationsPage', basePathAndPathPrefix + 'mica/:type/:study/#population-:population');
    // ngObibaMicaUrlProvider.setUrl('StudyDcePage', basePathAndPathPrefix + 'mica/:type/:study/#dce-id-:dce');
    // ngObibaMicaUrlProvider.setUrl('DatasetPage', basePathAndPathPrefix + 'mica/:type/:dataset');
    // ngObibaMicaUrlProvider.setUrl('BaseUrl', basePathAndPathPrefix);
    // ngObibaMicaUrlProvider.setUrl('FileBrowserFileResource', basePathAndPathPrefix + 'mica/file');
    // ngObibaMicaUrlProvider.setUrl('FileBrowserSearchResource', basePathAndPathPrefix + 'mica/files/search');
    // ngObibaMicaUrlProvider.setUrl('FileBrowserDownloadUrl', basePathAndPathPrefix + 'mica/file/download' + ((Drupal.settings.basePath.indexOf('?q=')!==-1)?'&':'?') + 'path=:path&inline=:inline&keyToken=:key');
    ngObibaMicaUrlProvider.setUrl('SearchBaseUrl', registry['SearchBaseUrl']);
    // ngObibaMicaUrlProvider.setUrl('SearchPage', basePathAndPathPrefix + 'mica/repository#/search?query=:query');
    // ngObibaMicaUrlProvider.setUrl('DocumentSuggestion', basePathAndPathPrefix + 'mica/repository/:documentType/_suggest/ws');
    // ngObibaMicaUrlProvider.setUrl('EntitiesCountResource', basePathAndPathPrefix + 'mica/analysis/entities_count/ws');
    // ngObibaMicaUrlProvider.setUrl('EntitiesCountBaseUrl', 'mica/analysis#/entities-count');
    // ngObibaMicaUrlProvider.setUrl('DatasetCategoricalVariablesResource', basePathAndPathPrefix + 'mica/:dsType/:dsId/variables/:query/categorical/ws');
    // ngObibaMicaUrlProvider.setUrl('DatasetVariablesResource', basePathAndPathPrefix + 'mica/:dsType/:dsId/variables/:query/ws');
    // ngObibaMicaUrlProvider.setUrl('DatasetVariableResource', basePathAndPathPrefix + 'mica/variable/:varId/ws');
    // ngObibaMicaUrlProvider.setUrl('DatasetVariablesCrosstabResource', basePathAndPathPrefix + 'mica/:dsType/:dsId/variables/cross/:v1/by/:v2/ws');
    // ngObibaMicaUrlProvider.setUrl('DatasetResource', basePathAndPathPrefix + 'mica/dataset/:dsType/:dsId/ws');
  }]);
  mica.config(['$routeProvider', '$locationProvider', 'ObibaServerConfigResourceProvider', '$translateProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, ObibaServerConfigResourceProvider, $translateProvider, $httpProvider) {
      $locationProvider.hashPrefix('');
      console.log('Conf get');
      // Initialize angular-translate
      $translateProvider
        .fallbackLanguage('en')
        .preferredLanguage('en')
        .useUrlLoader('http://localhost/ws/config/i18n/en.json')
        .useSanitizeValueStrategy('escaped')
        .use('en');
      var basicAuth = drupalSettings.angularApp.basicAth;

      $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + basicAuth;

      ObibaServerConfigResourceProvider.setFactory(
        ['MicaConfigResource', function(MicaConfigResource){
          return {get: MicaConfigResource.get};
        }]
      );

    }]);

mica
  .provider('SessionProxy',
    function () {
      function Proxy(user) {
        var roles = Object.keys(user.roles).map(function (key) {
          return user.roles[key];
        });
        var real = {login: user.name, roles: roles, profile: user.data || null};

        this.login = function () {
          return real.login;
        };

        this.roles = function () {
          return real.roles;
        };

        this.profile = function () {
          return real.profile;
        };
      }

      this.$get = function() {
        return new Proxy({cache: 0,
          hostname: '::1',
          roles: {1: 'anonymous user'},
          session: 'micasid|s:36:"b1e1bbaa-b5d1-478b-be65-04ca416046d1";',
          timestamp: '1572381198',
          uid: 0});
      };
    });

  mica.run(['amMoment','PublicMicaConfigResource', function(amMoment, PublicMicaConfigResource){
    var config = PublicMicaConfigResource.get();
    console.log(config);
    amMoment.changeLocale('en');
  }]);
mica.controller('MainController', [
  function () {
  }]);
