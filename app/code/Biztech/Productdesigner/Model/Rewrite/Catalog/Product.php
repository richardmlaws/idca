<?php
/**
 * Copyright © 2015 Biztech. All rights reserved.
 */

namespace Biztech\Productdesigner\Model\Rewrite\Catalog;
use Magento\Framework\App\Filesystem\DirectoryList;
class Product extends \Magento\Catalog\Model\Product
{   
   public function getAllMediaGalleryImages()
    {
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $mediaDirectory = $objectManager->create('\Magento\Framework\Filesystem');

        $directory = $mediaDirectory->getDirectoryRead(DirectoryList::MEDIA);
        if (!$this->hasData('media_gallery_images') && is_array($this->getMediaGallery('images'))) {
            $images = $this->_collectionFactory->create();
            foreach ($this->getMediaGallery('images') as $image) {
                /*if ((isset($image['disabled']) && $image['disabled']) || empty($image['value_id'])) {
                    continue;
                }*/
                $image['url'] = $this->getMediaConfig()->getMediaUrl($image['file']);
                $image['id'] = $image['value_id'];
                $image['path'] = $directory->getAbsolutePath($this->getMediaConfig()->getMediaPath($image['file']));
                $images->addItem(new \Magento\Framework\DataObject($image));
            }
            $this->setData('media_gallery_images', $images);
        }

        return $this->getData('media_gallery_images');
    }

}

