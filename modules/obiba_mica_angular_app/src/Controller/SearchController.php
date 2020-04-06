<?php
/**
 * Created by IntelliJ IDEA.
 * User: samir
 * Date: 18/11/19
 * Time: 4:07 PM
 */

namespace Drupal\obiba_mica_angular_app\Controller;


class SearchController extends AngularAppController{
private $currentPath;



public function __construct() {
  $this->currentPath = \Drupal::service('path.current')->getPath();;
}

public  function repository(){
  $listJsOption = [
    'angularModule' => 'mica.search',
  ];
  return $this->page($listJsOption, 'obiba_mica_angular_app/obiba_mica_search');
}

}