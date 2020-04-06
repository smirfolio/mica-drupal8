<?php

/**
* Implements hook_drush_command().
*/
function obiba_mica_angular_app_drush_command() {

$commands['download-js'] = [
'description' => 'Download Obiba mica js dependencies.',
'aliases' => ['obibadj'],
'examples' => [
  'drush obibadj' => 'Download Obiba mica js dependencies',
  ],
];

return $commands;
}

/**
 * Drush command logic.
 * drush_[MODULE_NAME]_[COMMAND_NAME]().
 */
function drush_obiba_mica_angular_app_download_js() {
  $distFolder = getAssetsPath();
  $folders =[];
  try{
    \Drupal::service('file_system')
      ->mkdir($distFolder, 0777, TRUE);
    exec("curl -Ls 'https://github.com/obiba/mica-drupal-js-libraries/archive/master.tar.gz' |  tar -xzf - -C  $distFolder/. --strip-components=1");
    drush_print(dt('<info>Create assets Folder : @distFolder</info>', array('@distFolder' => $distFolder)));
  }catch (\Drupal\Core\File\Exception\FileException $e){
    drush_print(dt('<warning>Something goes wrong : </warning>'));
  }
  $folders = file_scan_directory($distFolder . '/', NULL, ['recurse' => FALSE, 'key' => 'uri']);
  foreach ($folders as $key => $value){
    drush_print(dt('Folders : @key', array(' @key' => $key)));
  }
}

function getAssetsPath() {
  return DRUPAL_ROOT . '/libraries';
}