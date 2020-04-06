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

mica.configNg
  .factory('MicaConfigResource', ['$resource',
    function ($resource) {
      return $resource('http://localhost/ws/config', {}, {
        'get': {
          method: 'GET',
        }
      });
    }])
  .factory('PublicMicaConfigResource', ['$resource',
    function ($resource) {
      return $resource('http://localhost/ws/config/_public', {}, {
        'get': {
          method: 'GET',
        }
      });
    }])
  .factory('TranslationsResource', ['$resource',
    function ($resource) {
      return $resource('http://localhost/ws/config/i18n/:id.json');
    }]);

