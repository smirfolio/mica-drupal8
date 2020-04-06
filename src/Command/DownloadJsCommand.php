<?php

namespace Drupal\obiba_mica\Command;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Drupal\Console\Core\Command\ContainerAwareCommand;

/**
 * Class DownloadJsCommand.
 *
 * Drupal\Console\Annotations\DrupalCommand (
 *     extension="obiba_mica",
 *     extensionType="module"
 * )
 */
class DownloadJsCommand extends ContainerAwareCommand {
  protected $repositoryUrl = 'https://github.com/obiba/mica-drupal-js-libraries/archive/master.tar.gz';
  /**
   * {@inheritdoc}
   */
  protected function configure() {
    $this
      ->setName('downloadJs')
      ->setDescription($this->trans('commands.downloadJs.description'));
  }

  /**
   * {@inheritdoc}
   */
  protected function initialize(InputInterface $input, OutputInterface $output) {
    parent::initialize($input, $output);
    $this->getIo()->info('initialize');
  }

  /**
   * {@inheritdoc}
   */
  protected function interact(InputInterface $input, OutputInterface $output) {
    $this->getIo()->info('interact');
  }

  /**
   * {@inheritdoc}
   */
  protected function execute(InputInterface $input, OutputInterface $output) {

    $this->getIo()->info('execute');
    $this->getIo()->info($this->trans('commands.downloadJs.messages.success'));
//    FileSystem::mkdir
    $distFolder = $this->getAssetsPath();
    $folders =[];
    try{
      \Drupal::service('file_system')
        ->mkdir($distFolder, 0777, TRUE);
      exec("curl -Ls $this->repositoryUrl |  tar -xzf - -C  $distFolder/. --strip-components=1");
      $output->writeln('<info>Create assets Folder : </info>' . $distFolder);
    }catch (\Drupal\Core\File\Exception\FileException $e){
      $output->writeln('<warning>Something goes wrong : </warning>');
    }
    $folders = file_scan_directory($distFolder . '/', NULL, ['recurse' => FALSE, 'key' => 'uri']);
    foreach ($folders as $key => $value){
      $this->getIo()->info('Folders :' . $key );
    }
  }

  /**
   * Gets the site path.
   *
   * Defaults to 'sites/default'. For testing purposes this can be overridden
   * using the DRUPAL_DEV_SITE_PATH environment variable.
   *
   * @return string
   *   The site path to use.
   */
  protected function getAssetsPath() {
    return DRUPAL_ROOT . '/libraries';
  }


}
