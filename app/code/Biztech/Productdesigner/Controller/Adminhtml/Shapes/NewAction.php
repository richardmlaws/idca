<?php
/**
 * Copyright © 2015 Biztech. All rights reserved.
 */

namespace Biztech\Productdesigner\Controller\Adminhtml\Shapes;

class NewAction extends \Biztech\Productdesigner\Controller\Adminhtml\Shapes
{

    public function execute()
    {
        $this->_forward('edit');
    }
}
