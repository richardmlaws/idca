var TierPriceClass = function() {};
TierPriceClass.prototype = {
    initialize: function(tierPrice) {
        TierPriceClass.tierPrice = JSON.parse(tierPrice);
        if (ProductDesigner.prototype.tier != undefined) {
            ProductDesigner.prototype.tier = TierPriceClass.tierPrice;
            ProductDesigner.prototype.observQtyChange();
            ProductDesigner.prototype.reloadPrintingPrice();
            ProductDesigner.prototype.observAddToCart();
        }
    },
}
var Clipartdesigner = function() {
    jQuery.extend(Clipartdesigner.prototype, {
        filterImageUrl: null,
        clipart_limit_data: null,
        initialize: function(filter_url, clipart_limit_data) {
            Clipartdesigner.prototype.clipart_limit_data = clipart_limit_data.data;
            Clipartdesigner.prototype.filterImageUrl = filter_url;
            this.observeImageSelect();
            this.observeImageSelectScroll();
            this.setCurrentSvgColor();
            var event = document.createEvent('Event');
        },
        observeFields: function() {
            if (jQuery('#clipart_categories')) {
                jQuery('.clipart-categories').on('selectric-change', function(ele) {
                    var data = {};
                    data['clipart_category_id'] = jQuery('#clipart_categories').val();
                    if (jQuery('#search_tag_field')) {
                        data['search_tag_field'] = jQuery('#search_tag_field').val();
                    }
                    ProductDesigner.prototype.clipartcount = 12;
                    ProductDesigner.prototype.clipartlimit = 12;
                    this.filterImagesByClipart(data);
                }.bind(this));
            }
            jQuery('#search_tag_field').on('keyup', function(e) {
                var data = {};
                data['clipart_category_id'] = jQuery('#clipart_categories').val();
                if (jQuery('#search_tag_field')) {
                    data['search_tag_field'] = jQuery('#search_tag_field').val();
                }
                this.filterImagesByClipart(data);
            }.bind(this));
        },
        filterImagesByClipart: function(data) {
            var data = data || {};
            if (jQuery('#product-images-loader') && jQuery('#product_list_container')) {
                jQuery('#product-images-loader').css("display", "block");
                jQuery('#clipart_images_container').html(jQuery('#product-images-loader').html());
            }
            jQuery('#more_clipart').attr("style", "display:none");
            jQuery('.no_more_cliparts').hide();
            jQuery.ajax({
                url: Clipartdesigner.prototype.filterImageUrl,
                method: 'post',
                data: {
                    data: data
                },
                success: function(data, textStatus, jqXHR) {
                    var response = JSON.parse(data);
                    if (response.status == 'success') {
                        jQuery('#more_clipart').attr("style", "display:block");
                        jQuery('.no_more_cliparts').hide();
                        jQuery('#clipart_images_container').html(response.images);
                        this.observeImageSelect();
                    } else {
                        alert('Something is wrong... Please try again.');
                    }
                }.bind(this),
                onFailure: function() {
                    alert('Something is wrong... Please try again.');
                }
            });
        },
        observeImageSelectScroll: function() {
            var offsetClipart = 0;
            var devicecheck = 0;
            jQuery('#more_clipart').on('click', function() {
                if (screen.width <= 699) {
                    devicecheck = 'mobile';
                } else {
                    devicecheck = 'desktop';
                }
                if (ProductDesigner.prototype.clipartlimit <= ProductDesigner.prototype.clipartcount) {
                    // jQuery('#more_clipart').attr("disabled", "disabled");
                    jQuery('#more_clipart').attr("style", "display:none");
                    jQuery('#clipart_list_loader').attr("style", "display:block");
                    if (devicecheck == 'desktop') {
                        ProductDesigner.prototype.clipartlimit = ProductDesigner.prototype.clipartlimit + 9;
                    } else {
                        ProductDesigner.prototype.clipartlimit = ProductDesigner.prototype.clipartlimit + 6;
                    }
                    var limitClipart = ProductDesigner.prototype.clipartlimit;
                    offsetClipart = limitClipart + offsetClipart;
                    displayRecordsClipart(limitClipart, offsetClipart);
                } else {
                    jQuery('#more_clipart').attr("style", "display:none");
                    jQuery('.no_more_cliparts').show();
                }
            });
        },
        observeImageSelect: function() {
            jQuery('#image_list .clipart-image').click(function(e, elm) {
                this.productDesigner = ProductDesigner.prototype;
                //e.stop();
                var img = e.target || e.srcElement;
                var url = decodeURIComponent(img.getAttribute('data-orig-url'));
                var ext = url.substr(url.length - 3);
                var resized_url = decodeURIComponent(img.getAttribute('src'));
                var price = decodeURIComponent(img.getAttribute('data-price'));
                var imagesCount = 0;
                var canvas = ProductDesigner.prototype.canvas;
                if (Clipartdesigner.prototype.clipart_limit_data.is_limit == 1) {
                    var canvas = ProductDesigner.prototype.canvas;
                    //var canvas = this.productDesigner.canvas;
                    var obj = canvas.getObjects();
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i].type == 'image') {
                            if (obj[i].tab == 'design') {
                                imagesCount++;
                            }
                        }
                    }
                    if (imagesCount > parseInt(Clipartdesigner.prototype.clipart_limit_data.limit) - 1) {
                        alert(Clipartdesigner.prototype.clipart_limit_data.limit_text);
                        return false;
                    }
                }
                var allObj = canvas.getObjects();
                for (var i = 0; i < allObj.length; i++) {
                    if (allObj[i] && (allObj[i].type == 'image' || allObj[i].type == 'path' || allObj[i].type == 'path-group')) {
                        var cmd = new RemoveCanvasObject(ProductDesigner.prototype, allObj[i]);
                        cmd.exec();
                        History.prototype.push(cmd);
                    }
                }
                jQuery('#pd_loading_img').show();
                if (ext == 'svg') {
                    fabric.loadSVGFromURL(url, function(objects, options) {
                        var obj = fabric.util.groupSVGElements(objects, options);
                        var canvas = ProductDesigner.prototype.canvas;
                        obj.set({
                            src: url,
                        });
                        if (obj.width != obj.height) {
                            if (obj.width > obj.height) {
                                var t_width = canvas.width;
                                var t_height = ((t_width * obj.height) / obj.width);
                                //fix height
                                if (t_height > canvas.height) {
                                    t_height = canvas.height;
                                    t_width = ((obj.width * t_height) / obj.height);
                                }
                            } else {
                                t_height = canvas.height;
                                t_width = ((obj.width * t_height) / obj.height);
                                //fix width
                                if (t_width > canvas.width) {
                                    t_width = canvas.width;
                                    t_height = ((t_width * obj.height) / obj.width);
                                }
                            }
                        } else {
                            t_width = t_height = Math.min(canvas.height, canvas.width);
                        }
                        obj.set({
                            tab: 'design',
                            heightAttr: parseFloat(t_height) - 20,
                            widthAttr: parseFloat(t_width) - 20,
                            obj_side: this.productDesigner.data.product.images[this.productDesigner.currentProductColor][this.productDesigner.currentProduct].side,
                            isScaleObj: true,
                            top: 5,
                            left: 5,
                            scaleY: 1,
                            scaleX: 1,
                            height: 20,
                            width: 20
                        });
                        if (jQuery('#add_text_area').val() != '' || jQuery('#add_text_area_2').val() != '') {
                            var allObj = canvas.getObjects();
                            for (var i = 0; i < allObj.length; i++) {
                                if (allObj[i].textarea != "undefined") {
                                    if (allObj[i].textarea == 'one' || allObj[i].textarea == 'two') {
                                        var cmd = new UpdateCommand(canvas, allObj[i], {
                                            left: 35
                                        });
                                        cmd.exec();
                                        allObj[i].setCoords();
                                    }
                                }
                            }
                        }
                        var cmd = new InsertCanvasObject(this.productDesigner, obj, true, '', true, '', ext);
                        cmd.exec();
                        jQuery('#pd_loading_img').hide();
                        History.prototype.push(cmd);
                    }.bind(this));
                } else {
                    fabric.Image.fromURL(url, function(obj) {
                        //var canvas = window.canvas;
                        var canvas = ProductDesigner.prototype.canvas;
                        if (obj.width != obj.height) {
                            if (obj.width > obj.height) {
                                var t_width = canvas.width;
                                var t_height = ((t_width * obj.height) / obj.width);
                                if (t_height > canvas.height) {
                                    t_height = canvas.height;
                                    t_width = ((obj.width * t_height) / obj.height);
                                }
                            } else {
                                t_height = canvas.height;
                                t_width = ((obj.width * t_height) / obj.height);
                                if (t_width > canvas.width) {
                                    t_width = canvas.width;
                                    t_height = ((t_width * obj.height) / obj.width);
                                }
                            }
                        } else {
                            t_width = t_height = Math.min(canvas.height, canvas.width);
                        }
                        if (jQuery('#add_text_area').val() != '' || jQuery('#add_text_area_2').val() != '') {
                            var allObj = canvas.getObjects();
                            for (var i = 0; i < allObj.length; i++) {
                                if (allObj[i].textarea != "undefined") {
                                    if (allObj[i].textarea == 'one' || allObj[i].textarea == 'two') {
                                        var cmd = new UpdateCommand(canvas, allObj[i], {
                                            left: 35
                                        });
                                        cmd.exec();
                                        allObj[i].setCoords();
                                    }
                                }
                            }
                        }
                        obj.set({
                            tab: 'design',
                            height: parseFloat(t_height) - 10,
                            width: parseFloat(t_width) - 10,
                            resized_url: resized_url,
                            price: price,
                            left: 5,
                            top: 5
                        });
                        var cmd = new InsertCanvasObject(this.productDesigner, obj, true);
                        cmd.exec();
                        jQuery('#pd_loading_img').hide();
                        History.prototype.push(cmd);
                    }.bind(this));
                }
            }.bind(this));
        },
        setCurrentSvgColor: function() {
            jQuery('#used_color_container_obj').on('click', '.used-color', function(e, elm) {
                jQuery('.used-color').each(function(index, val) {
                    jQuery(val).removeClass('selected');
                });
                var eleattr = e.target || e.srcElement;
                var currSvgColor = eleattr.getAttribute('colorid');
                jQuery(eleattr).addClass('selected');
                ProductDesigner.prototype.CurrImageSvgColor = currSvgColor;
            }.bind(this));
        },
    });
}
var ImageUploader = function() {};
ImageUploader.prototype = {
    upload_limit_data: null,
    uploadedImageObject: {},
    maxFileSize: null,
    allowedImageExtension: null,
    uploadImgUrl: null,
    imageCount: 0,
    initialize: function(maxFileSize, allowedImageExtensions, allowedImageExtensionsFormate, uploadImgUrl, upload_limit_data) {
        ImageUploader.upload_limit_data = upload_limit_data.data;
        ImageUploader.prototypemaxFileSize = maxFileSize;
        ImageUploader.allowedImageExtension = allowedImageExtensions;
        ImageUploader.allowedImageExtensionsFormated = allowedImageExtensionsFormate;
        ImageUploader.uploadImgUrl = uploadImgUrl;
        this.observeSubmitForm();
        this.productDesigner = ProductDesigner.prototype;
        this.observeImageSelect();
        this.observeRemoveImages();
        this.imageFileName();
        if (jQuery('#upload_agreement') != null) this.observeAgrrementButton();
    },
    imageFileName: function() {
        jQuery('#image_upload').on('change', function(e) {
            jQuery('#filename').val(e.target.value.replace("C:\\fakepath\\", ""));
        }.bind(this));
    },
    observeSubmitForm: function() {
        jQuery('#upload_images').submit(function() {
            if (jQuery('#image_upload')) {
                var errorContainer = jQuery('#upload-image-error');
                jQuery('#image_upload_loader').show();
                //var files = $('image_upload').files;
                var errors = {};
                var errorsCount = 0;
                errorContainer.html('');
                errorContainer.hide();
                jQuery('#upload_images')[0].target = 'uploadedImageSave';
                jQuery('#uploadedImageSave').one('load', function() {
                    var response = window.frames['uploadedImageSave'].document.body.innerHTML;
                    var IS_JSON = true;
                    try {
                        var json = jQuery.parseJSON(response);
                    } catch (err) {
                        IS_JSON = false;
                    }
                    if (IS_JSON) {
                        var response_text = jQuery.parseJSON(response);
                        var error_msg = response_text.error_message;
                        if (response_text.status == 'fail') {
                            jQuery('#upload-image-error').addClass('validation-advice');
                            jQuery('#upload-image-error').show();
                            jQuery('#upload-image-error').html('<p>' + jQuery.parseJSON(response).error_message + '</p>');
                        }
                    } else {
                        jQuery('#uploaded_images').html(jQuery('#uploaded_images').html() + response);
                        jQuery('#remove_uploaded_img').show();
                    }
                    jQuery('#image_upload').val('');
                    jQuery('#image_upload_loader').hide();
                });
                jQuery('#filename').val('');
            }
        });
    },
    observeAgrrementButton: function() {
        jQuery('#upload_agreement').on('click', function(e) {
            if (jQuery('#upload_agreement').is(":checked")) {
                jQuery('#image_upload_btn').removeAttr('disabled');
                jQuery('#image_upload_btn').removeClass('disabled');
            } else {
                jQuery('#image_upload_btn').attr('disabled', 'disabled');
                jQuery('#image_upload_btn').addClass('disabled');
            }
        }.bind(this));
    },
    observeRemoveImages: function() {
        jQuery('#remove_uploaded_img').on('click', function(e) {
            jQuery('#uploaded_images').html('');
            jQuery('#upload-image-error').removeClass('validation-advice');
            jQuery('#upload-image-error').html('');
            jQuery('#remove_uploaded_img').hide();
            jQuery('#image_upload').val('');
            //            for (key in this.uploadedImageObject)
            //            {
            //                this.productDesigner.canvas.remove(this.uploadedImageObject[key]);
            //            }
        }.bind(this));
        jQuery('#uploaded_images .delete_image').click(function(e, elm) {
            var r = confirm("Are you sure to delete this image?");
            if (r == true) {
                var img = e.target || e.srcElement;
                img.up().remove();
            }
        }.bind(this));
    },
    observeImageSelect: function() {
        jQuery('#uploaded_images').on('click', '.clipart-image', function(e) {
            this.productDesigner = ProductDesigner.prototype;
            var img = e.target || e.srcElement;
            var url = decodeURIComponent(img.getAttribute('data-orig-url'));
            var resized_url = decodeURIComponent(img.getAttribute('src'));
            var ext = url.substr(url.length - 3);
            var customImagesCount = 0;
            var canvas = this.productDesigner.canvas;
            if (ImageUploader.upload_limit_data.is_limit == 1) {
                var canvas = this.productDesigner.canvas;
                canvas.isDrawingMode = false;
                var obj = canvas.getObjects();
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].type == 'image') {
                        if (obj[i].tab == 'upload') {
                            customImagesCount++;
                        }
                    }
                }
                if (customImagesCount > parseInt(ImageUploader.upload_limit_data.limit) - 1) {
                    alert(ImageUploader.upload_limit_data.limit_text);
                    return false;
                }
            }
            var allObj = canvas.getObjects();
            for (var i = 0; i < allObj.length; i++) {
                if (allObj[i] && (allObj[i].type == 'image' || allObj[i].type == 'path' || allObj[i].type == 'path-group')) {
                    var cmd = new RemoveCanvasObject(ProductDesigner.prototype, allObj[i]);
                    cmd.exec();
                    History.prototype.push(cmd);
                }
            }
            jQuery('#pd_loading_img').show();
            if (ext == 'svg') {
                fabric.loadSVGFromURL(url, function(objects, options) {
                    var canvas = this.productDesigner.canvas;
                    var obj = fabric.util.groupSVGElements(objects, options);
                    obj.set({
                        src: url,
                    });
                    //ImageUploader.uploadedImageObject[ImageUploader.imageCount] = obj;
                    if (obj.width != obj.height) {
                        if (obj.width > obj.height) {
                            var t_width = canvas.width;
                            var t_height = ((t_width * obj.height) / obj.width); //fix height
                            if (t_height > canvas.height) {
                                t_height = canvas.height;
                                t_width = ((obj.width * t_height) / obj.height);
                            }
                        } else {
                            t_height = canvas.height;
                            t_width = ((obj.width * t_height) / obj.height);
                            //fix width
                            if (t_width > canvas.width) {
                                t_width = canvas.width;
                                t_height = ((t_width * obj.height) / obj.width);
                            }
                        }
                    } else {
                        t_width = t_height = Math.min(canvas.height, canvas.width);
                    }
                    obj.set({
                        tab: 'design',
                        heightAttr: parseFloat(t_height) - 20,
                        widthAttr: parseFloat(t_width) - 20,
                        obj_side: this.productDesigner.data.product.images[this.productDesigner.currentProductColor][this.productDesigner.currentProduct].side,
                        isScaleObj: true,
                        top: 5,
                        left: 5,
                        scaleY: 0.5,
                        scaleX: 0.5
                    });
                    if (jQuery('#add_text_area').val() != '' || jQuery('#add_text_area_2').val() != '') {
                        var allObj = canvas.getObjects();
                        for (var i = 0; i < allObj.length; i++) {
                            if (allObj[i].textarea != "undefined") {
                                if (allObj[i].textarea == 'one' || allObj[i].textarea == 'two') {
                                    var cmd = new UpdateCommand(canvas, allObj[i], {
                                        left: 35
                                    });
                                    cmd.exec();
                                    allObj[i].setCoords();
                                }
                            }
                        }
                    }
                    var cmd = new InsertCanvasObject(this.productDesigner, obj, true);
                    cmd.exec();
                    jQuery('#pd_loading_img').hide();
                    History.prototype.push(cmd);
                    ImageUploader.imageCount++;
                }.bind(this));
            } else {
                fabric.Image.fromURL(url, function(obj) {
                    var canvas = this.productDesigner.canvas;
                    ImageUploader.uploadedImageObject[ImageUploader.imageCount] = obj;
                    if (obj.width != obj.height) {
                        if (obj.width > obj.height) {
                            var t_width = canvas.width;
                            var t_height = ((t_width * obj.height) / obj.width);
                            //fix height
                            if (t_height > canvas.height) {
                                t_height = canvas.height;
                                t_width = ((obj.width * t_height) / obj.height);
                            }
                        } else {
                            t_height = canvas.height;
                            t_width = ((obj.width * t_height) / obj.height);
                            //fix width
                            if (t_width > canvas.width) {
                                t_width = canvas.width;
                                t_height = ((t_width * obj.height) / obj.width);
                            }
                        }
                    } else {
                        t_width = t_height = Math.min(canvas.height, canvas.width);
                    }
                    if (jQuery('#add_text_area').val() != '' || jQuery('#add_text_area_2').val() != '') {
                        var allObj = canvas.getObjects();
                        for (var i = 0; i < allObj.length; i++) {
                            if (allObj[i].textarea != "undefined") {
                                if (allObj[i].textarea == 'one' || allObj[i].textarea == 'two') {
                                    var cmd = new UpdateCommand(canvas, allObj[i], {
                                        left: 35
                                    });
                                    cmd.exec();
                                    allObj[i].setCoords();
                                }
                            }
                        }
                    }
                    obj.set({
                        tab: 'upload',
                        height: parseFloat(t_height) - 10,
                        width: parseFloat(t_width) - 10,
                        resized_url: resized_url,
                        obj_side: this.productDesigner.data.product.images[this.productDesigner.currentProductColor][this.productDesigner.currentProduct].side,
                        top: 5,
                        left: 5
                    });
                    var cmd = new InsertCanvasObject(this.productDesigner, obj, true);
                    cmd.exec();
                    jQuery('#pd_loading_img').hide();
                    History.prototype.push(cmd);
                    ImageUploader.imageCount++;
                }.bind(this));
            }
        });
    }
};
var ProductDesigner = function() {};
ProductDesigner.prototype = {
    opt: {
        product_side_id: 'product-sides'
    },
    canvas: null,
    data: null,
    pricesContainers: {},
    designArea: null,
    currentDesignArea: null,
    currentDesignAreaId: null,
    scaleFactor: null,
    product_default_color: null,
    prices: null,
    containerCanvases: {},
    product_container_layers: {},
    designChanged: {},
    currentProductColor: null,
    currentImageSide: null,
    currentImageSideArea: {},
    ImageSideAreaObject: {},
    designId: null,
    designs: null,
    ImageSideObject: {},
    product_container: null,
    currentProduct: null,
    zoomCount: 0,
    productAdditionalImageHtml: null,
    nameAdd: false,
    numberAdd: false,
    windowWidth: null,
    ImageMultipleArray: {},
    CurrImageSvgColor: null,
    windowHeight: null,
    loginUrl: null,
    logindesignUrl: null,
    registerUrl: null,
    downloadUrl: null,
    saveDesignUrl: null,
    continueUrl: null,
    productUrl: null,
    brushUrl: null,
    allowDownload: null,
    isAdmin: null,
    isCustomerLogin: null,
    designIdSave: null,
    fbUrl: null,
    twUrl: null,
    gUrl: null,
    clickedSocialButton: null,
    firstImageId: null,
    shareImage: 0,
    imageSize: {},
    previewImageUrl: null,
    addtocarturl: null,
    productlimit: 0,
    productcount: 0,
    clipartlimit: 0,
    clipartcount: 0,
    shapeslimit: 0,
    shapescount: 0,
    maskinglimit: 0,
    maskingcount: 0,
    designslimit: 0,
    designscount: 0,
    templateslimit: 0,
    templatescount: 0,
    addtocartbuttonclicked: 0,
    initialize: function(data, loginUrl, logindesignUrl, registerUrl, downloadUrl, saveDesignUrl, continueUrl, productUrl, allowDownload, brushUrl, previewImageUrl, addtocarturl, getmydesignUrl, facebookUrl, googleUrl, sendmailUrl, isAdmin, mediaUrl, tierPriceUrl) {
        if (data.action == 'full') {
            jQuery('#maincontent').removeClass("page-main");
        }
        ProductDesigner.prototype.data = data;
        ProductDesigner.prototype.design_id = data.design_id;
        ProductDesigner.prototype.templateId = data.template_id;
        ProductDesigner.prototype.mediaUrl = mediaUrl;
        ProductDesigner.prototype.designs = data.designs;
        ProductDesigner.prototype.prices = data.prices;
        ProductDesigner.prototype.tier = TierPriceClass.tierPrice;
        ProductDesigner.prototype.loginUrl = loginUrl;
        ProductDesigner.prototype.logindesignUrl = logindesignUrl;
        ProductDesigner.prototype.registerUrl = registerUrl;
        ProductDesigner.prototype.downloadUrl = downloadUrl;
        ProductDesigner.prototype.previewImageUrl = previewImageUrl;
        ProductDesigner.prototype.tierPriceUrl = tierPriceUrl;
        ProductDesigner.prototype.saveDesignUrl = saveDesignUrl;
        ProductDesigner.prototype.multiper = data.multiper;
        ProductDesigner.prototype.facebookUrl = facebookUrl;
        ProductDesigner.prototype.googleUrl = googleUrl;
        ProductDesigner.prototype.sendmailUrl = sendmailUrl;
        ProductDesigner.prototype.continueUrl = continueUrl;
        ProductDesigner.prototype.productUrl = productUrl;
        ProductDesigner.prototype.allowDownload = allowDownload;
        ProductDesigner.prototype.addtocarturl = addtocarturl;
        ProductDesigner.prototype.isAdmin = isAdmin;
        ProductDesigner.prototype.brushUrl = brushUrl;
        ProductDesigner.prototype.getmydesign = getmydesignUrl;
        this.canvasScale = 1;
        ProductDesigner.prototype.isCustomerLogin = data.isCustomerLoggedIn;
        ProductDesigner.prototype.isCustomerId = data.isCustomerId;
        ProductDesigner.prototype.scaleFactor = 1.8;
        ProductDesigner.prototype.product_default_color = data.product_default_color;
        ProductDesigner.prototype.windowWidth = window.innerWidth;
        ProductDesigner.prototype.windowHeight = window.innerHeight;
        ProductDesigner.prototype.product_container = data.main_container;
        ProductDesigner.prototype.designId = data.design_id;
        ProductDesigner.prototype.productAdditionalImageHtml = jQuery('#product-side-images').html();
        ProductDesigner.prototype.productlimit = 12;
        ProductDesigner.prototype.productcount = 12;
        ProductDesigner.prototype.clipartlimit = 12;
        ProductDesigner.prototype.clipartcount = 12;
        ProductDesigner.prototype.shapeslimit = 12;
        ProductDesigner.prototype.shapescount = 12;
        ProductDesigner.prototype.maskinglimit = 12;
        ProductDesigner.prototype.maskingcount = 12;
        ProductDesigner.prototype.designslimit = 12;
        ProductDesigner.prototype.designscount = 12;
        ProductDesigner.prototype.templateslimit = 12;
        ProductDesigner.prototype.templatescount = 12;
        ProductDesigner.prototype.addtocartbuttonclicked = 0;
        this.initProduct(data.product);
        this.observSelectTab();
        this.observeControls();
        this.toggleImageSelectedClass();
        this.observeZoomButton();
        this.observQtyChange();
        this.observePreviewButton();
        this.observeProductSideImageChange();
        this.observeProductColorChange();
        this.observeDownloadButton();
        this.observeMailShareButton();
        this.observeHistory();
        this.observeSides();
        this.initPrices();
        this.observeLoginBtn();
        this.observeRegisterBtn();
        this.observeCloseTab();
        this.observRegisterSubmitBtn();
        this.observeSaveDesignButton();
        this.observeShareButtons();
        this.observeContinueButton();
        this.observAddToCart();
        setTimeout(function() {
            ProductDesigner.prototype.clickMaskingImage();
        }, 3000);
        this.observeSelectDesignArea();
        this.loadSavedDesign();
        this.observeGetStoredDesignButton();
        this.observeGroupToolTip();
        if (ProductDesigner.prototype.data.colorpicker_enable == 0) {
            this.getClipartColorContent();
            this.observerClipartColorChange();
            this.getClipartColorBrushContent();
            this.observerClipartColorBrushChange();
        }
        /*if (ProductDesigner.prototype.data.productType == 'simple') {
         this.observeGroupToolTipSimple();
         }*/
        this.reloadPrice();
        this.reloadPrintingPrice();
        jQuery('#choose_masking').click();
        jQuery('#text_tab').click();
        this.layersManager = new LayersManager();
        this.layersManager.initialize();
        /*jQuery(document).on('keydown', function (e) {
            this.productDesigner = ProductDesigner.prototype;
            if (e.which == 46) {
                if ((this.canvas == null) || this.canvas == 'undefined') {
                    return;
                }
                var obj = this.canvas.getActiveObject();
                if (obj) {
                    var cmd = new RemoveCanvasObject(this.productDesigner, obj);
                    cmd.exec();
                    History.prototype.push(cmd);
                }
            }
        }.bind(this));*/
        jQuery('.resp-tabs-container').click(function(e, elm) {
            if (jQuery(e.target).hasClass('color-img') || jQuery(e.target).hasClass('text-color') || jQuery(e.target).parent().hasClass('text-color') || jQuery(e.target).hasClass('color-img') || jQuery(e.target).hasClass('button-bg') || jQuery(e.target).parent().hasClass('button-bg') || jQuery(e.target).hasClass('text-shadow-color') || jQuery(e.target).parent().hasClass('text-shadow-color') || jQuery(e.target).hasClass('text-stroke-color') || jQuery(e.target).parent().hasClass('text-stroke-color') || jQuery(e.target).hasClass('clipart-color-container') || jQuery(e.target).hasClass('masking-color') || jQuery(e.target).parent().hasClass('masking-color') || jQuery(e.target).hasClass('brush_color') || jQuery(e.target).parent().hasClass('brush_color') || jQuery(e.target).parent().hasClass('obj_color') || jQuery(e.target).hasClass('obj_color')) {} else {
                if (ProductDesigner.prototype.data.colorpicker_enable == 0) {
                    jQuery('#text-shadowcolor-container').hide();
                    jQuery('#text-strokecolor-container').hide();
                    jQuery('#text-bgcolor-container').hide();
                    jQuery('#text-strokecolor-container').hide();
                    jQuery('#text-color-container').hide();
                    if (jQuery('#grouptext-color-container')) jQuery('#grouptext-color-container').hide();
                    jQuery('#clipart-color-container').hide();
                    jQuery('#clipart-color-container_brush').hide();
                }
            }
        }.bind(this));
        jQuery('.pd-container').click(function(e, elm) {
            if (e.target.className != "upper-canvas canvas-panel" && e.target.parentElement.parentElement.className != 'product-controls' && e.target.parentElement.parentElement.parentElement.className != 'product-controls') {
                jQuery('#text_prop_container').addClass('disabled');
                jQuery('#text_prop_container').attr('disabled', 'disabled');
                jQuery('#group_font_properties').addClass('disabled');
                jQuery('#name-number-content').addClass('disabled');
                this.canvas.deactivateAll().renderAll();
                this._observeControlButtons();
                this._observeTextButtons();
                this._observeTextColorButtons();
                jQuery('#layers_manager').hide();
                if (ProductDesigner.prototype.data.colorpicker_enable == 0) {
                    jQuery('#text-shadowcolor-container').hide();
                    jQuery('#text-strokecolor-container').hide();
                    jQuery('#text-bgcolor-container').hide();
                    jQuery('#text-color-container').hide();
                    jQuery('#clipart-color-container_brush').hide();
                    jQuery('#clipart-color-container').hide();
                    // if ($('grouptext-color-container'))
                    jQuery('#grouptext-color-container').hide();
                }
            }
        }.bind(this));
    },
    _observeTextButtons: function() {
        var textButtons = TextDesigner.buttonsMap;
        var method = this.canvas.getActiveObject() ? 'addClass' : 'removeClass';
        for (var key in textButtons) {
            if ((key != 'undo' && key != 'redo') && textButtons.hasOwnProperty(key)) {
                var btn = jQuery(textButtons[key]);
                btn[method].apply(btn, ['selected']);
            }
        }
    },
    observeGroupToolTip: function() {
        jQuery(function() {
            jQuery(".printing-method-block input[name='printing_type']").click(function() {
                if (jQuery('input:radio[name=printing_type]:checked').val()) {
                    var printCode = document.querySelector('input[name="printing_type"]:checked').getAttribute('data-code');
                    jQuery('.printing-method-description').each(function(val, index) {
                        jQuery('#' + index.id).hide();
                    });
                    jQuery('#' + printCode + '-des').show();
                    ProductDesigner.prototype.observeCanvas();
                    ProductDesigner.prototype.observColorCountObj();
                    ProductDesigner.prototype.reloadPrintingPrice();
                }
            });
        });
    },
    observeGroupToolTipSimple: function() {
        jQuery(function() {
            jQuery("#printing-method-block-simple input[name='printing_type']").click(function() {
                if (jQuery('input:radio[name=printing_type]:checked').val()) {
                    var printCode = document.querySelector('input[name="printing_type"]:checked').getAttribute('data-code');
                    $$('.printing-method-description').each(function(index, val) {
                        $(index.id).style.display = 'none';
                    });
                    $(printCode + '-des').show();
                    ProductDesigner.reloadPrintingPrice();
                    $('price_calculation').show();
                }
            });
            jQuery('.change_text').keyup(function(event) {
                ProductDesigner.reloadPrintingPrice();
            });
            jQuery('.dropdowncustomOption').change(function() {
                ProductDesigner.reloadPrintingPrice();
            });
            jQuery('.multipleOption').change(function() {
                ProductDesigner.reloadPrintingPrice();
            });
            jQuery('.CustomRadioOption').change(function() {
                ProductDesigner.reloadPrintingPrice();
            });
            jQuery('.CustomCheckboxOption').change(function() {
                ProductDesigner.reloadPrintingPrice();
            });
            jQuery('#customOptionFormProdSettings input:checkbox').click(function() {
                var $this = jQuery(this);
                ProductDesigner.reloadPrintingPrice();
            });
        });
    },
    _observeTextColorButtons: function() {
        var textColorButtons = TextDesigner.textColorMap;
        var method = this.canvas.getActiveObject() ? 'addClassName' : 'removeClassName';
        for (var key in textColorButtons) {
            if (textColorButtons.hasOwnProperty(key)) {
                var btn = jQuery(textColorButtons[key]);
                if (btn[0] == jQuery('#text_color')[0]) {
                    btn[0].childNodes[0].style.borderColor = '#000000';
                }
                if (btn[0] == jQuery('#text_bg_color')[0]) {
                    btn[0].childNodes[0].style.borderColor = '#FFFFFF';
                }
            }
        }
    },
    observeCanvas: function() {
        this.observeCanvasObjectMoving();
        this.observeCanvasSelection();
        this.observeObjectModified();
        this.observeCanvasObjectRendered();
        this.observeCanvasObjectScalling();
    },
    observeCanvasObjectScalling: function() {
        if ((this.canvas == null) || this.canvas == 'undefined') {
            return;
        }
        this.canvas.on('object:scaling', function(event) {
            var el = event.target;
            if (el && (el.height * el.scaleX) > 1 && (el.left + (el.width * el.scaleX)) < this.canvas.width && (el.top + (el.height * el.scaleY)) < this.canvas.height && el.left > 0 && el.top > 0) {
                previous_scaleY = el.scaleY;
                previous_scaleX = el.scaleX;
                previous_left = el.left;
                previous_top = el.top;
            }
            if (el && (el.height * el.scaleX) < 1) {
                //if(el.getBoundingRect().top < 0 || el.getBoundingRect().left < 0){
                el.left = previous_left;
                el.top = previous_top;
                el.scaleX = previous_scaleX;
                el.scaleY = previous_scaleY;
                // el.lockScalingX=true;
                // el.lockScalingY= true;
                //this.canvas.renderAll();
            }
            if (el && (el.left + (el.width * el.scaleX)) > this.canvas.width || ((el.top + (el.height * el.scaleY)) > this.canvas.height) || el.left < 0 || el.top < 0) {
                //if(el.getBoundingRect().top+el.getBoundingRect().height  > el.canvas.height || el.getBoundingRect().left+el.getBoundingRect().width  > el.canvas.width){
                /* el.left=previous_left;
                 el.top=previous_top;
                 
                 el.scaleX=previous_scaleX;
                 el.scaleY=previous_scaleY;
                 this.canvas.renderAll();*/
            }
        }.bind(this));
        /*
         this.canvas.on('object:rotating', function(event){
         var el = e.target;
         if (el && el.getAngle() != el.originalState.angle){
         
         previous_angle=el.originalState.angle;
         }
         
         
         if ((el.getBoundingRect().left + (el.width*el.scaleX)) > this.canvas.width || ((el.getBoundingRect().top + (el.height*el.scaleY)) > this.canvas.height) || el.getBoundingRect().left < 0 ||el.getBoundingRect().top < 0 ){
         
         el.setAngle(previous_angle);
         this.canvas.renderAll();
         
         }
         
         
         
         }.bind(this));*/
    },
    observeObjectModified: function() {
        if ((this.canvas == null) || this.canvas == 'undefined') {
            return;
        }
        this.canvas.observe('object:modified', function(e) {
            var currentState = e.target.originalState;
            var target = e.target;
            // Check when object is moving
            // if (currentState.left != target.left || currentState.top != target.top) {
            //     if ((target.left + target.width/2 <= 0) || (target.left - target.width/2 >= this.canvas.getWidth())) {
            //         return;
            //     } else if ((target.top + target.height/2 <= 0) || (target.top - target.height/2 >= this.canvas.getHeight())) {
            //         return;
            //     }
            //     var cmd = new MovingObjectHistory(
            //         this.canvas,
            //         this.canvas.getActiveObject(),
            //         {left : currentState.left, top: currentState.top},
            //         {left : e.target.left, top: e.target.top}
            //     );
            //     this.history.push(cmd);
            // }
            // Check when object has been rotated
            if (currentState.angle != target.angle) {
                var obj = this.canvas.getActiveObject();
                var cmd = new RotateObjectHistory(this.canvas, obj, {
                    angle: currentState.angle,
                    left: currentState.left,
                    top: currentState.top
                }, {
                    angle: target.angle,
                    left: e.target.left,
                    top: e.target.top
                });
                History.prototype.push(cmd);
            }
            // Check object has been resized
            if (currentState.scaleX != target.scaleX || currentState.scaleY != target.scaleY) {
                var cmd = new ResizeObjectHistory(this.canvas, this.canvas.getActiveObject(), {
                    scaleX: currentState.scaleX,
                    scaleY: currentState.scaleY
                }, {
                    scaleX: target.scaleX,
                    scaleY: target.scaleY
                });
                History.prototype.push(cmd);
            }
        }.bind(this));
    },
    observeCanvasObjectRendered: function() {
        if ((this.canvas == null) || this.canvas == 'undefined') {
            return;
        }
        this.canvas.observe('after:render', function(e) {
            var n = 0;
            this.canvas.forEachObject(function(o) {
                var objectCanvas = o.canvas;
                if (ProductDesigner.prototype.data.base_unit == "cm") {
                    o.canvas.areaWidth = o.canvas.width / (37.79);
                    o.canvas.areaHeight = o.canvas.height / (37.79);
                } else if (ProductDesigner.prototype.data.base_unit == "px") {
                    o.canvas.areaWidth = o.canvas.width;
                    o.canvas.areaHeight = o.canvas.height;
                }
                if (ProductDesigner.prototype.data.base_unit == "cm") {
                    var objectCanvasWidth = parseFloat(o.canvas.areaWidth) * 37.79;
                    var objectCanvasHeight = parseFloat(o.canvas.areaHeight) * 37.79;
                } else if (ProductDesigner.prototype.data.base_unit == "px") {
                    var objectCanvasWidth = parseFloat(o.canvas.areaWidth) * 1;
                    var objectCanvasHeight = parseFloat(o.canvas.areaHeight) * 1;
                }
                var widthAspectRatio = Number(objectCanvasWidth / objectCanvas.width).toFixed(2);
                var heightAspectRatio = Number(objectCanvasHeight / objectCanvas.height).toFixed(2);
                o.set({
                    currWidthObjNew: o.currentWidth * widthAspectRatio,
                    currHeightObjNew: o.currentHeight * heightAspectRatio,
                    currTopObjNew: o.top,
                    currLeftObjNew: o.left,
                    DesignAreaWidthNew: o.canvas.areaWidth,
                    DesignAreaHeightNew: o.canvas.areaHeight,
                });
                var l = o.getBoundingRect().left;
                var t = o.getBoundingRect().top;
                var w = Math.round(o.getWidth() / 2);
                var h = Math.round(o.getHeight() / 2);
                var f = false;
                if (l < 0) f = true;
                if (t < 0) f = true;
                if (parseFloat(t) + parseFloat(o.getBoundingRect().height) > this.canvas.getHeight()) f = true;
                if (parseFloat(l) + parseFloat(o.getBoundingRect().width) > this.canvas.getWidth()) f = true;
                if (f) {
                    n++;
                }
            }.bind(this));
            if (n > 0) {
                this.designArea.style.border = '1px dashed red';
                jQuery('#print_area_warning').show();
            } else {
                this.designArea.style.border = '1px dashed';
                jQuery('#print_area_warning').hide();
            }
            if (!this.canvas.getActiveObject()) {
                return;
            }
        }.bind(this));
    },
    observeCanvasSelection: function() {
        if ((this.canvas == null) || this.canvas == 'undefined') {
            return;
        }
        this.canvas.on('object:selected', function(e) {
            ProductDesigner.prototype.observColorCountObj();
            //this.objSelectEvent(this.canvas.getActiveObject());
            if (isMobile.any()) {
                jQuery('#res-overlay').show();
            }
            jQuery('#resp-tabs-container').show();
            if (e.target.type == 'text' || e.target.type == 'group') {
                if (ProductDesigner.prototype.data.colorpicker_enable == 0) {
                    jQuery('#text-shadowcolor-container').hide();
                    jQuery('#text-strokecolor-container').hide();
                    jQuery('#text-bgcolor-container').hide();
                    jQuery('#text-strokecolor-container').hide();
                    jQuery('#text-color-container').hide();
                    if (jQuery('#grouptext-color-container')) jQuery('#grouptext-color-container').hide();
                    jQuery('#clipart-color-container').hide();
                    jQuery('#clipart-color-container_brush').hide();
                }
                if (e.target.tab == 'grouporder') {
                    jQuery('#name-number-content').removeClass('disabled');
                    jQuery('#group_font_properties').removeClass('disabled');
                    var font_size = e.target.fontSize ? e.target.fontSize : jQuery('#group_font_size_selection').val();
                    jQuery('#group_size_label').html(" (" + font_size + ")");
                    jQuery('#group_font_size_selection').val(font_size);
                    var field = jQuery('#group_text_color');
                    jQuery(field).children().css('borderColor', e.target.fill ? e.target.fill : '#FFFFFF');
                    if (jQuery('#group_font_properties .selectric .label')[0] != undefined) jQuery('#group_font_properties .selectric .label')[0].textContent = e.target.fontFamily;
                    jQuery('#group_font_properties .font_option').each(function(index) {
                        jQuery(index).removeClass('selected');
                        if (jQuery(index).textContent == e.target.fontFamily) {
                            jQuery(index).addClass('selected');
                        }
                    });
                    jQuery('#group_font_selection').prop('value', e.target.fontFamily).selectric('refresh');
                    if (e.target.group_type == 'name') {
                        if (jQuery('#isname').prop("checked") == false) {
                            if (e.target.mydesign) {
                                jQuery('#isname').prop("checked", true);
                                if (jQuery('#group-table')[0].tBodies[0].rows.length == 0) {
                                    getGroupHtml(Groupdesigner.sizeArray, jQuery('#add_another_button'));
                                    GroupDesigner.prototype.observeValidation();
                                    GroupDesigner.prototype.setProductSizes();
                                }
                                var len = jQuery('#group-table')[0].tBodies[0].rows.length;
                                for (var j = 0; j < len; j++) {
                                    jQuery(jQuery('#group-table')[0].tBodies[0].rows[j].children[0].childNodes[0]).addClass('required-entry');
                                    jQuery(jQuery('#group-table')[0].tBodies[0].rows[j].children[2].childNodes[0]).addClass('validate-select');
                                    jQuery(jQuery('#group-table')[0].tBodies[0].rows[j].children[3].childNodes[0]).addClass('required-entry validate-digits');
                                }
                                //ProductDesigner.setPrintSize();
                                //ProductDesigner.reloadPrice(len);
                                jQuery('.product-side-img').each(function(index, val) {
                                    var currentProduct = jQuery(val)[0].getAttribute('data-image_id');
                                    if (ProductDesigner.prototype.currentProduct == currentProduct) {
                                        jQuery('#group_side_label').show();
                                        jQuery('#group_side_value').html(ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].side);
                                    }
                                }.bind(this));
                                GroupDesigner.prototype.groupSide = ProductDesigner.prototype.currentDesignArea;
                                jQuery('#name_0').val(e.target.text);
                                jQuery('#name_0').removeAttr('disabled');
                            }
                        }
                    }
                    if (e.target.group_type == 'number') {
                        if (jQuery('#isnumber').prop("checked") == false) {
                            if (e.target.mydesign) {
                                jQuery('#isnumber').prop("checked", true);
                                if (jQuery('#group-table')[0].tBodies[0].rows.length == 0) {
                                    getGroupHtml(Groupdesigner.sizeArray, jQuery('#add_another_button'));
                                    GroupDesigner.prototype.observeValidation();
                                    GroupDesigner.prototype.setProductSizes();
                                }
                                var len = jQuery('#group-table')[0].tBodies[0].rows.length;
                                for (var j = 0; j < len; j++) {
                                    jQuery(jQuery('#group-table')[0].tBodies[0].rows[0].children[0].childNodes[0]).addClass('required-entry');
                                    jQuery(jQuery('#group-table')[0].tBodies[0].rows[j].children[2].childNodes[0]).addClass('validate-select');
                                    jQuery(jQuery('#group-table')[0].tBodies[0].rows[j].children[3].childNodes[0]).addClass('required-entry validate-digits');
                                }
                                //ProductDesigner.setPrintSize();
                                //ProductDesigner.reloadPrice(len);
                                jQuery('.product-side-img').each(function(index, val) {
                                    var currentProduct = jQuery(val)[0].getAttribute('data-image_id');
                                    if (ProductDesigner.prototype.currentProduct == currentProduct) {
                                        jQuery('#group_side_label').show();
                                        jQuery('#group_side_value').html(ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].side);
                                    }
                                }.bind(this));
                                GroupDesigner.prototype.groupSide = ProductDesigner.prototype.currentDesignArea;
                                var options = jQuery('#select.group-size');
                                if (options[0] != undefined) {
                                    var len = options[0].length;
                                    for (var i = 0; i < len; i++) {
                                        if (options[0][i].value == e.target.last_row_size) {
                                            options[0][i].selected = true;
                                        }
                                    }
                                }
                                jQuery('#number_0').val(e.target.text);
                                jQuery('#number_0').removeAttr('disabled');
                            }
                        }
                    }
                }
                if (e.target.tab == 'text' || e.target.tab == 'textTab') {
                    jQuery("#text_prop_container").removeAttr('disabled');
                    var font_size = e.target.fontSize ? e.target.fontSize : jQuery('#font_size_selection').val();
                    jQuery('#size_label').html(" (" + font_size + ")");
                    jQuery('#font_size_selection').val(font_size);
                    var opacity = e.target.opacity ? e.target.opacity : jQuery('#opacity').val();
                    jQuery('#opacity_label').html(" (" + opacity + ")");
                    jQuery('#opacity').val(opacity);
                    var obj = e.target;
                    if (jQuery('#font_properties .selectric .label')[0] != undefined) jQuery('#font_properties .selectric .label')[0].textContent = e.target.fontFamily;
                    jQuery('#font_properties .font_option').each(function(index, val) {
                        jQuery(val).removeClass('selected');
                        if (jQuery(val)[0].textContent == e.target.fontFamily) {
                            jQuery(val).addClass('selected');
                        }
                    });
                    jQuery('.font_selection').prop('value', e.target.fontFamily).selectric('refresh');
                    if (obj.shadow) {
                        var xoffset = obj.shadow.offsetX ? obj.shadow.offsetX : jQuery('#shadow_x_range').val();
                        jQuery('#xoffset_label').html(" (" + xoffset + ")");
                        jQuery('#shadow_x_range').val(xoffset);
                        var yoffset = obj.shadow.offsetY ? obj.shadow.offsetY : jQuery('#shadow_y_range').val();
                        jQuery('#yoffset_label').html(" (" + yoffset + ")");
                        jQuery('#shadow_y_range').val(yoffset);
                        var blur = obj.shadow.blur ? obj.shadow.blur : jQuery('#shadow_blur').val();
                        jQuery('#blur_label').html(" (" + blur + ")");
                        jQuery('#shadow_blur').val(blur);;
                    } else {
                        var xoffset = 0;
                        jQuery('#xoffset_label').html(" (" + xoffset + ")");
                        jQuery('#shadow_x_range').val(xoffset);
                        var yoffset = 0;
                        jQuery('#yoffset_label').html(" (" + yoffset + ")");
                        jQuery('#shadow_y_range').val(yoffset);
                        var blur = 0;
                        jQuery('#blur_label').html(" (" + blur + ")");
                        jQuery('#shadow_blur').val(blur);
                    }
                    if (obj.strokeWidth != '1') {
                        var width = obj.strokeWidth ? obj.strokeWidth : jQuery('#stroke_width').val();
                        jQuery('#stroke_width').val(width);
                        if (width != 2) {
                            width = parseInt(width.toString().split('.')[1]);
                        } else {
                            width = 10;
                        }
                        jQuery('#stroke_width_label').html(" (" + width + ")");
                        var field = jQuery('#text_stroke_color');
                        jQuery(field).children().css('borderColor', obj.stroke ? obj.stroke : '#FFFFFF');
                    } else if (obj.type == 'group' && obj._objects[0] && obj._objects[0].strokeWidth != 1) {
                        var width = obj._objects[0].strokeWidth ? obj._objects[0].strokeWidth : jQuery('#stroke_width').val();
                        jQuery('#stroke_width').val(width);
                        if (width != 2) {
                            width = parseInt(width.toString().split('.')[1]);
                        } else {
                            width = 10;
                        }
                        jQuery('#stroke_width_label').html(" (" + width + ")");
                        var field = jQuery('#text_stroke_color');
                        jQuery(field).children().css('borderColor', obj._objects[0].stroke ? obj._objects[0].stroke : '#000000');
                    } else {
                        var width = 1;
                        jQuery('#stroke_width_label').html(" (" + width + ")");
                        jQuery('#stroke_width').val(width);
                    }
                    if (obj.arc != undefined) {
                        var arc = obj.arc ? obj.arc : jQuery('#text_arc').val();
                        jQuery('#arc_label').html(" (" + arc + ")");
                        jQuery('#text_arc').val(arc);
                    } else {
                        var arc = 0;
                        jQuery('#arc_label').html(" (" + arc + ")");
                        jQuery('#text_arc').val(arc);
                    }
                    if (obj.spacing != undefined) {
                        var spacing = obj.spacing ? obj.spacing : jQuery('#text_spacing').val();
                        jQuery('#spacing_label').html(" (" + spacing + ")");
                        jQuery('#text_spacing').val(spacing);
                    } else {
                        var spacing = 0;
                        jQuery('#spacing_label').html(" (" + spacing + ")");
                        jQuery('#text_spacing').val(spacing);
                    }
                }
                var event = document.createEvent('Event');
                event.obj = e.target;
                event.initEvent('textTabShow', true, true);
                document.dispatchEvent(event);
            }
            if (e.target.type == 'image' || (e.target.type == 'path-group') || (e.target.type == 'path')) {
                if (e.target.type == 'path-group' || e.target.type == 'path') {
                    jQuery("#effects").hide();
                } else {
                    jQuery("#effects").show();
                }
                jQuery('#effects input').each(function(index) {
                    jQuery(index).prop("checked", false);
                });
                var filters = e.target.filters;
                if (filters != undefined) {
                    for (var i = 0; i < filters.length; i++) {
                        if (filters[i].type == "Grayscale") {
                            jQuery('Grayscale').prop("checked", true);
                        }
                        if (filters[i].type == "Sepia") {
                            jQuery('Sepia').prop("checked", true);
                        }
                        if (filters[i].type == "Sepia2") {
                            jQuery('Sepia2').prop("checked", true);
                        }
                        if (filters[i].type == "Invert") {
                            jQuery('Invert').prop("checked", true);
                        }
                    }
                }
            }
            this._observeControlButtons();
        }.bind(this));
        this.canvas.on('selection:cleared', function(e) {
            jQuery('#img_customize').hide();
            this._observeControlButtons();
            this._observeTextButtons();
            this._observeTextColorButtons();
            jQuery('#text_prop_container').addClass('disabled');
            jQuery('#text_prop_container').attr('disabled', 'disabled');
            jQuery('#group_font_properties').addClass('disabled');
            jQuery('#name-number-content').addClass('disabled');
        }.bind(this));
    },
    observeCanvasObjectMoving: function() {
        if ((this.canvas == null) || this.canvas == 'undefined') {
            return;
        }
        this.canvas.observe('object:moving', function(e) {
            var obj = e.target; // if object is too big ignore
            if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
                return;
            }
            obj.setCoords();
            // top-left  corner
            if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
                obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
                obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
            }
            // bot-right corner
            if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
                obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
                obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
            }
            if (parseFloat(obj.getBoundingRect().left) <= (obj.canvas.width / 2 - obj.getBoundingRect().width / 2) + parseFloat(3) && parseFloat(obj.getBoundingRect().left) >= (obj.canvas.width / 2 - obj.getBoundingRect().width / 2) - parseFloat(3)) {
                // $('obj-center-warning').show();
            } else {
                // $('obj-center-warning').hide();
            }
        }.bind(this));
    },
    objSelectEvent: function(obj) {
        if (obj) {
            var event = document.createEvent('Event');
            event.obj = obj;
            event.initEvent('ObjSelect', true, true);
            document.dispatchEvent(event);
        }
    },
    initProduct: function(product, color) {
        if (!product) {
            return;
        }
        if (!color) {
            color = product.default_color;
        }
        if (!product.images.hasOwnProperty(color)) {
            return;
        }
        ProductDesigner.prototype.currentProductColor = color;
        var images = product.images[color];
        for (var prop in images) {
            if (images.hasOwnProperty(prop)) {
                ProductDesigner.prototype.firstImageId = prop;
                var img = images[prop];
                this.setDesignArea(img);
                jQuery('.product-side-img').each(function(index, val) {
                    //e.currentTarget.getAttribute('data-image_id')
                    if (val.getAttribute('data-image_id') == prop) {
                        jQuery(val).parent().addClass('selected');
                    }
                });
                this.resizeCanvas(img);
                return;
            }
        }
    },
    getClipartColorContent: function() {
        jQuery('#obj_color').on('click', function(e) {
            jQuery('#clipart-color-container').toggle();
        });
    },
    observerClipartColorChange: function() {
        jQuery('#clipart-color-container').on('click', '.clipart-color-img', function(event) {
            var self = this;
            var ele = event.target;
            var color = event.target.getAttribute('data-color_id');
            this.productDesigner = ProductDesigner.prototype;
            var canvas = ProductDesigner.prototype.canvas;
            var obj = canvas.getActiveObject();
            if (obj && ((obj.type == 'path-group') || (obj.type == 'path'))) {
                var t_color = ProductDesigner.prototype.CurrImageSvgColor;
                var t_color_hex = new RGBColor(t_color);
                if (obj.paths == undefined) {
                    var cmd = new ObjectSvgColorHistory(ProductDesigner.prototype.canvas, obj, t_color, color);
                    cmd.exec();
                    History.prototype.push(cmd);
                } else {
                    var cmd = new ObjectSvgMultipleColorHistory(ProductDesigner.prototype.canvas, obj, t_color_hex, color);
                    cmd.exec();
                    History.prototype.push(cmd);
                }
            } else {
                var cmd = new ObjectColorHistory(ProductDesigner.prototype.canvas, obj, color);
                cmd.exec();
                History.prototype.push(cmd);
            }
            jQuery('#clipart_color_title').html(event.target.getAttribute('data-color_name'));
            /*$$('.clipart-color-img').each(function (index, val) {
             index.up().removeClassName('selected');
             });
             ele.up().addClassName('selected');*/
        });
    },
    getClipartColorBrushContent: function() {
        jQuery('#brush_color').on('click', function(e) {
            jQuery('#clipart-color-container_brush').toggle();
        });
    },
    observerClipartColorBrushChange: function() {
        jQuery('#clipart-color-container_brush').on('click', '.clipart-color-img-brush', function(event) {
            var self = this;
            var ele = event.target;
            var color = event.target.getAttribute('data-color_id');
            ProductDesigner.prototype.canvas.freeDrawingBrush.color = color;
            jQuery('#clipart_color_title_brush').html(event.target.getAttribute('data-color_name'));
        });
    },
    setzIndexes: function() {
        jQuery('#pd_loading_img').show();
        for (var i in ProductDesigner.prototype.zIndexes) {
            jQuery(ProductDesigner.prototype.containerCanvases[ProductDesigner.prototype.currentDesignArea].getObjects()).each(function(i, obj) {
                obj.moveTo(ProductDesigner.prototype.zIndexes[obj.obj_id]);
            });
        }
        jQuery('#pd_loading_img').hide();
    },
    loadSavedDesign: function() {
        var params = getUrlParams();
        var data = {};
        if ((this.data.my_design_url != undefined) && (params.design != undefined)) {
            jQuery('#pd_loading_img').show();
            data["shapes_category_id"] = params.design;
            jQuery.ajax({
                url: this.data.my_design_url,
                method: 'post',
                data: {
                    data: data
                },
                success: function(data, textStatus, jqXHR) {
                    var response = JSON.parse(data);
                    ProductDesigner.prototype.zIndexes = {};
                    if (response.design_id != null && response.design_id != '') {
                        var p_color = response.selected_product_color;
                        jQuery('.product-colors .color-img').each(function(index, val) {
                            if (val.getAttribute('data-color_id') == p_color) {
                                var color = val.getAttribute('data-color_id');
                                if (ProductDesigner.prototype.currentProductColor != color) {
                                    jQuery(val).addClass('selected');
                                    //index.up().addClassName('selected');
                                    ProductDesigner.product_default_color_id = val.getAttribute('data-color_id');
                                    ProductDesigner.prototype.changeProductColor(color, canvas);
                                    ProductDesigner.prototype._observeNavButtons('disabled');
                                }
                            }
                        });
                        jQuery('.product-side-img').each(function(index, val) {
                            if (index != 0) jQuery('.product-side-img')[index].click();
                            jQuery('#pd_loading_img').show();
                        }.bind(this));
                        jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                        jQuery('#pd_loading_img').show();
                        var designs = JSON.parse(response.designs);
                        var flag = 0;
                        var total_objects = Object.keys(designs).length;
                        var masking = JSON.parse(response.masking);
                        if (response.product_id == ProductDesigner.prototype.data.productId) {
                            var arcObjects = {};
                            for (var i in designs) {
                                var design_obj = designs[i];
                                var img_url = design_obj.url;
                                var tab = design_obj.tab;
                                var product_id = design_obj.product_id;
                                if (design_obj.wInnerWidth < 640 && design_obj.wInnerWidth != window.innerWidth) {
                                    if (design_obj.wInnerWidth < 640 && design_obj.wInnerWidth >= 480) {
                                        if (window.innerWidth >= 480) {
                                            scaleFactor = 1.4;
                                            var top = design_obj.top * scaleFactor;
                                            var left = design_obj.left * scaleFactor;
                                            var width = design_obj.width * scaleFactor;
                                            var height = design_obj.height * scaleFactor;
                                            design_obj.top = design_obj.top * scaleFactor;
                                            design_obj.left = design_obj.left * scaleFactor;
                                            design_obj.width = design_obj.width * scaleFactor;
                                            design_obj.height = design_obj.height * scaleFactor;
                                        } else {
                                            if (window.innerWidth > 360) {
                                                scaleFactor = 1.4;
                                            } else if (window.innerWidth >= 320) {
                                                scaleFactor = 1.8;
                                            } else {
                                                scaleFactor = 2.3;
                                            }
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                    }
                                    if (design_obj.wInnerWidth < 480 && design_obj.wInnerWidth >= 360) {
                                        if (window.innerWidth >= 360) {
                                            scaleFactor = 1.8;
                                            var top = design_obj.top * scaleFactor;
                                            var left = design_obj.left * scaleFactor;
                                            var width = design_obj.width * scaleFactor;
                                            var height = design_obj.height * scaleFactor;
                                            design_obj.top = design_obj.top * scaleFactor;
                                            design_obj.left = design_obj.left * scaleFactor;
                                            design_obj.width = design_obj.width * scaleFactor;
                                            design_obj.height = design_obj.height * scaleFactor;
                                        } else {
                                            if (window.innerWidth >= 320) {
                                                scaleFactor = 1.8;
                                            } else {
                                                scaleFactor = 2.3;
                                            }
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                    }
                                    if (design_obj.wInnerWidth < 360 && design_obj.wInnerWidth >= 320) {
                                        if (window.innerWidth >= 320) {
                                            scaleFactor = 2.3;
                                            var top = design_obj.top * scaleFactor;
                                            var left = design_obj.left * scaleFactor;
                                            var width = design_obj.width * scaleFactor;
                                            var height = design_obj.height * scaleFactor;
                                            design_obj.top = design_obj.top * scaleFactor;
                                            design_obj.left = design_obj.left * scaleFactor;
                                            design_obj.width = design_obj.width * scaleFactor;
                                            design_obj.height = design_obj.height * scaleFactor;
                                        } else {
                                            scaleFactor = 2.3;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                    }
                                    if (design_obj.wInnerWidth < 320) {
                                        scaleFactor = 3.4;
                                        var top = design_obj.top * scaleFactor;
                                        var left = design_obj.left * scaleFactor;
                                        var width = design_obj.width * scaleFactor;
                                        var height = design_obj.height * scaleFactor;
                                        design_obj.top = design_obj.top * scaleFactor;
                                        design_obj.left = design_obj.left * scaleFactor;
                                        design_obj.width = design_obj.width * scaleFactor;
                                        design_obj.height = design_obj.height * scaleFactor;
                                    }
                                } else {
                                    if (design_obj.wInnerWidth != window.innerWidth) {
                                        if (window.innerWidth < 640 && window.innerWidth >= 480) {
                                            scaleFactor = 1.4;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                        if (window.innerWidth < 480 && window.innerWidth >= 360) {
                                            scaleFactor = 1.8;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                        if (window.innerWidth < 360 && window.innerWidth >= 320) {
                                            scaleFactor = 2.3;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                        if (window.innerWidth < 320) {
                                            scaleFactor = 3.4;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                    }
                                }
                                var top = design_obj.top;
                                var left = design_obj.left;
                                var type = design_obj.type;
                                var price = design_obj.price;
                                var image_id = design_obj.image_id;
                                var image_id1 = '@' + design_obj.image_id;
                                var object_id = i;
                                var objFilters = design_obj.objFilters;
                                var used_colors_old = design_obj.used_colors_old;
                                var brush_path = design_obj.brush_path;
                                var name = design_obj.name;
                                var scalex = design_obj.scalex;
                                var scaley = design_obj.scaley;
                                var objWidth = design_obj.width;
                                var objHeight = design_obj.height;
                                var group_type = design_obj.group_type;
                                var last_row_size = design_obj.last_row_size;
                                if (type == 'text' || type == 'group') {
                                    if (type == 'group') {
                                        var arcText = '';
                                        var arcObject = {};
                                        arcObject.textObj = design_obj.textObj;
                                        for (var i = 0; i < design_obj.textObj.objects.length; i++) {
                                            var newObj = design_obj.textObj.objects[i];
                                            if (newObj.type == 'text') {
                                                arcText = arcText + design_obj.textObj.objects[i].text;
                                                arcObject.textObj.fontFamily = design_obj.textObj.objects[0].fontFamily;
                                                arcObject.textObj.fontWeight = design_obj.textObj.objects[0].fontWeight;
                                                arcObject.textObj.fontStyle = design_obj.textObj.objects[0].fontStyle;
                                                arcObject.textObj.textDecoration = design_obj.textObj.objects[0].textDecoration;
                                                arcObject.textObj.fill = design_obj.textObj.objects[0].fill;
                                                arcObject.textObj.textBackgroundColor = design_obj.textObj.objects[0].textBackgroundColor;
                                                arcObject.textObj.textAlign = design_obj.textObj.objects[0].textAlign;
                                                arcObject.textObj.stroke = design_obj.textObj.objects[0].stroke;
                                                arcObject.textObj.strokeWidth = design_obj.textObj.objects[0].strokeWidth;
                                                arcObject.textObj.shadow = design_obj.textObj.objects[0].shadow;
                                                arcObject.textObj.shadow = design_obj.textObj.objects[0].shadow;
                                            }
                                        }
                                        arcObject.textObj.type = 'text';
                                        arcObject.textObj.tab = design_obj.tab ? design_obj.tab : "text";
                                        arcObject.textObj.name = design_obj.name ? design_obj.name : '';
                                        arcObject.textObj.designarea_id = design_obj.designarea_id;
                                        arcObject.textObj.mydesign = true;
                                        arcObject.textObj.image_side = design_obj.image_side;
                                        arcObject.textObj.image_id = '@' + design_obj.image_id;
                                        arcObject.textObj.arc = design_obj.arc;
                                        arcObject.textObj.arcObjText = arcText;
                                        arcObjects[i] = arcObject;
                                    } else {
                                        var text = design_obj.text;
                                        design_obj.textObj.tab = design_obj.tab ? design_obj.tab : "text";
                                        design_obj.textObj.name = design_obj.name ? design_obj.name : '';
                                        design_obj.textObj.designarea_id = design_obj.designarea_id;
                                        design_obj.textObj.mydesign = true;
                                        design_obj.textObj.image_side = design_obj.image_side;
                                        design_obj.textObj.image_id = '@' + design_obj.image_id;
                                        var textObject = new fabric.Text(text, design_obj.textObj);
                                        textObject.set({
                                            group_type: group_type,
                                            last_row_size: last_row_size,
                                            textarea: design_obj.textarea
                                        })
                                        var cmd = new InsertCanvasObject(ProductDesigner.prototype, textObject);
                                        ProductDesigner.prototype.zIndexes[textObject.obj_id] = design_obj.zIndex;
                                        cmd.exec();
                                        History.prototype.push(cmd);
                                        jQuery('#pd_loading_img').show();
                                        flag++;
                                        if (total_objects == flag) {
                                            jQuery('#pd_loading_img').show();
                                            ProductDesigner.prototype.setzIndexes();
                                            jQuery('#pd_loading_img').show();
                                            setTimeout(function() {
                                                jQuery('#pd_loading_img').show();
                                                jQuery('.product-side-img').each(function(index, val) {
                                                    if (index != 0) jQuery('.product-side-img')[index].click();
                                                }.bind(this));
                                                jQuery('#pd_loading_img').show();
                                                if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                    jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                }
                                                jQuery('#pd_loading_img').hide();
                                                for (var key in LayersManager.prototype.layers) {
                                                    var obj = LayersManager.prototype.layers[key];
                                                    if (obj || obj != null) {
                                                        if (obj.type == 'text') {
                                                            ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                            jQuery('#btn_left_align').click();
                                                            jQuery('#pd_loading_img').hide();
                                                        }
                                                    }
                                                }
                                            }, 4000);
                                        }
                                    }
                                } else {
                                    if (((design_obj.type == 'path-group') || (design_obj.type == 'path')) && (design_obj.name != 'brush')) {
                                        var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                        var objData = design_obj;
                                        var scalex = design_obj.scalex;
                                        var scaley = design_obj.scaley;
                                        var objTop = design_obj.top;
                                        var objLeft = design_obj.left;
                                        var objWidth = design_obj.width;
                                        var objHeight = design_obj.height;
                                        var angle = design_obj.angle;
                                        var obj_id = design_obj.obj_id;
                                        var image_id = design_obj.image_id;
                                        var obj_side = design_obj.obj_side;
                                        var used_colors = design_obj.used_colors;
                                        var used_colors_old = design_obj.used_colors_old;
                                        var textObject = designs[i];
                                        fabric.loadSVGFromURL(url, (function(objData) {
                                            return function(objects, options) {
                                                var obj = fabric.util.groupSVGElements(objects, options);
                                                obj.set({
                                                    top: objData.top,
                                                    left: objData.left,
                                                    width: objData.width,
                                                    height: objData.height,
                                                    scaleX: objData.scaleX,
                                                    scaleY: objData.scaleY,
                                                    angle: objData.angle,
                                                    tab: objData.tab,
                                                    image_id: objData.image_id,
                                                    obj_side: objData.obj_side,
                                                    obj_id: 'id_' + Date.now(),
                                                    image_side: objData.image_side,
                                                    image_id1: objData.image_id1,
                                                    resized_url: objData.url,
                                                    designarea_id: objData.designarea_id,
                                                    tab: objData.tab,
                                                    mydesign: true,
                                                    src: objData.src,
                                                    isScaleObj: true,
                                                    used_colors_old: objData.used_colors_old,
                                                });
                                                var cmd = new InsertCanvasObject(ProductDesigner.prototype, obj);
                                                ProductDesigner.prototype.zIndexes[obj.obj_id] = objData.zIndex;
                                                cmd.exec();
                                                History.prototype.push(cmd);
                                                jQuery('#pd_loading_img').show();
                                                flag++;
                                                if (total_objects == flag) {
                                                    jQuery('#pd_loading_img').show();
                                                    ProductDesigner.prototype.setzIndexes();
                                                    jQuery('#pd_loading_img').show();
                                                    setTimeout(function() {
                                                        jQuery('#pd_loading_img').show();
                                                        jQuery('.product-side-img').each(function(index, val) {
                                                            if (index != 0) jQuery('.product-side-img')[index].click();
                                                        }.bind(this));
                                                        jQuery('#pd_loading_img').show();
                                                        if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                            jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                        }
                                                        jQuery('#pd_loading_img').hide();
                                                        for (var key in LayersManager.prototype.layers) {
                                                            var obj = LayersManager.prototype.layers[key];
                                                            if (obj || obj != null) {
                                                                if (obj.type == 'text') {
                                                                    ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                    jQuery('#btn_left_align').click();
                                                                    jQuery('#pd_loading_img').hide();
                                                                }
                                                            }
                                                        }
                                                    }, 4000);
                                                }
                                            }
                                        })({
                                            top: objTop,
                                            left: objLeft,
                                            width: objWidth,
                                            height: objHeight,
                                            scaleX: scalex,
                                            scaleY: scaley,
                                            angle: design_obj.angle,
                                            image_side: design_obj.image_side,
                                            image_id1: image_id1,
                                            zIndex: design_obj.zIndex,
                                            resized_url: design_obj.url,
                                            designarea_id: design_obj.designarea_id,
                                            tab: design_obj.tab,
                                            mydesign: true,
                                            image_id: design_obj.image_id,
                                            obj_side: design_obj.obj_side,
                                            obj_id: 'id_' + Date.now(),
                                            src: url,
                                            isScaleObj: true,
                                            used_colors_old: used_colors_old,
                                        }));
                                        //}
                                    } else {
                                        var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                        var objData = design_obj;
                                        var scalex = design_obj.scalex;
                                        var scaley = design_obj.scaley;
                                        var objTop = design_obj.top;
                                        var objLeft = design_obj.left;
                                        var objWidth = design_obj.width;
                                        var objHeight = design_obj.height;
                                        var angle = design_obj.angle;
                                        var obj_id = design_obj.obj_id;
                                        var image_id = design_obj.image_id;
                                        var obj_side = design_obj.obj_side;
                                        var used_colors = design_obj.used_colors;
                                        var used_colors_old = design_obj.used_colors_old;
                                        var textObject = designs[i];
                                        var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                        fabric.Image.fromURL(url, (function(objData) {
                                            return function(obj) {
                                                obj.set({
                                                    top: objData.top,
                                                    left: objData.left,
                                                    width: objData.width,
                                                    height: objData.height,
                                                    scaleX: objData.scaleX,
                                                    scaleY: objData.scaleY,
                                                    mydesign: true,
                                                    angle: objData.angle,
                                                    tab: objData.tab,
                                                    resized_url: design_obj.url,
                                                    image_id: '@' + objData.image_id,
                                                    designarea_id: objData.designarea_id,
                                                    obj_side: objData.obj_side,
                                                    image_side: objData.image_side,
                                                    obj_id: 'id_' + Date.now(),
                                                    src: objData.src,
                                                    isScaleObj: true,
                                                    used_colors_old: objData.used_colors_old,
                                                    textObj: objData.textObj,
                                                    objFilters: objData.objFilters
                                                });
                                                var cmd = new InsertCanvasObject(ProductDesigner.prototype, obj, false);
                                                ProductDesigner.prototype.zIndexes[obj.obj_id] = objData.zIndex;
                                                cmd.exec();
                                                History.prototype.push(cmd);
                                                jQuery('#pd_loading_img').show();
                                                flag++;
                                                if (total_objects == flag) {
                                                    jQuery('#pd_loading_img').show();
                                                    ProductDesigner.prototype.setzIndexes();
                                                    jQuery('#pd_loading_img').show();
                                                    setTimeout(function() {
                                                        jQuery('#pd_loading_img').show();
                                                        jQuery('.product-side-img').each(function(index, val) {
                                                            if (index != 0) jQuery('.product-side-img')[index].click();
                                                        }.bind(this));
                                                        jQuery('#pd_loading_img').show();
                                                        if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                            jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                        }
                                                        jQuery('#pd_loading_img').hide();
                                                        for (var key in LayersManager.prototype.layers) {
                                                            var obj = LayersManager.prototype.layers[key];
                                                            if (obj || obj != null) {
                                                                if (obj.type == 'text') {
                                                                    ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                    jQuery('#btn_left_align').click();
                                                                    jQuery('#pd_loading_img').hide();
                                                                }
                                                            }
                                                        }
                                                    }, 4000);
                                                }
                                            }
                                        })({
                                            top: objTop,
                                            left: objLeft,
                                            width: objWidth,
                                            height: objHeight,
                                            scaleX: scalex,
                                            price: price,
                                            scaleY: scaley,
                                            angle: design_obj.angle,
                                            resized_url: design_obj.url,
                                            designarea_id: design_obj.designarea_id,
                                            mydesign: true,
                                            zIndex: design_obj.zIndex,
                                            tab: design_obj.tab,
                                            obj_side: design_obj.obj_side,
                                            image_side: design_obj.image_side,
                                            obj_id: 'id_' + Date.now(),
                                            used_colors: design_obj.used_colors,
                                            isScaleObj: true,
                                            image_id: design_obj.image_id,
                                            src: url,
                                            textObj: design_obj.textObj,
                                            objFilters: design_obj.objFilters
                                        }));
                                    }
                                }
                            }
                            if (arcText != '' && arcText != undefined) {
                                for (key in arcObjects) {
                                    var textObject = new fabric.Text(arcObjects[key].textObj.arcObjText, arcObjects[key].textObj);
                                    var cmd = new InsertCanvasObject(ProductDesigner.prototype, textObject);
                                    cmd.exec();
                                    History.prototype.push(cmd);
                                    var currentArc = parseInt(jQuery('#text_arc').val());
                                    //var canvas = ProductDesigner.prototype.canvas;
                                    var canvas = ProductDesigner.prototype.containerCanvases[arcObjects[key].textObj.designarea_id];
                                    var defaultArc = arcObjects[key].textObj.arc ? arcObjects[key].textObj.arc : 0;
                                    cmd = new TextSpaceAngleChange(ProductDesigner.prototype, canvas, {
                                        arc: defaultArc
                                    }, {
                                        arc: currentArc
                                    });
                                    cmd.exec();
                                    History.prototype.push(cmd);
                                    flag++;
                                }
                            }
                            for (var i in masking) {
                                var canvas = ProductDesigner.prototype.containerCanvases[i];
                                var url = ProductDesigner.prototype.mediaUrl + masking[i].url;
                                var DesignId = i;
                                fabric.loadSVGFromURL(url, (function(objData) {
                                    return function(objects, options) {
                                        var canvas = objData.Canvas;
                                        var url = objData.Url;
                                        var DesignId = objData.design_id;
                                        var cmd = new ObjectMaskingHistory(canvas, objects, options, url, DesignId);
                                        cmd.exec();
                                        History.prototype.push(cmd);
                                    }
                                })({
                                    Canvas: canvas,
                                    Url: url,
                                    design_id: DesignId,
                                }));
                            }
                        } else {
                            var r = confirm('This design is not made for this product, Do You want to continue?');
                            if (r == true) {
                                var arcObjects = {};
                                for (var i in designs) {
                                    var design_obj = designs[i];
                                    var img_url = design_obj.url;
                                    var tab = design_obj.tab;
                                    var product_id = design_obj.product_id;
                                    if (design_obj.wInnerWidth < 640 && design_obj.wInnerWidth != window.innerWidth) {
                                        if (design_obj.wInnerWidth < 640 && design_obj.wInnerWidth >= 480) {
                                            if (window.innerWidth >= 480) {
                                                scaleFactor = 1.4;
                                                var top = design_obj.top * scaleFactor;
                                                var left = design_obj.left * scaleFactor;
                                                var width = design_obj.width * scaleFactor;
                                                var height = design_obj.height * scaleFactor;
                                                design_obj.top = design_obj.top * scaleFactor;
                                                design_obj.left = design_obj.left * scaleFactor;
                                                design_obj.width = design_obj.width * scaleFactor;
                                                design_obj.height = design_obj.height * scaleFactor;
                                            } else {
                                                if (window.innerWidth > 360) {
                                                    scaleFactor = 1.4;
                                                } else if (window.innerWidth >= 320) {
                                                    scaleFactor = 1.8;
                                                } else {
                                                    scaleFactor = 2.3;
                                                }
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                        }
                                        if (design_obj.wInnerWidth < 480 && design_obj.wInnerWidth >= 360) {
                                            if (window.innerWidth >= 360) {
                                                scaleFactor = 1.8;
                                                var top = design_obj.top * scaleFactor;
                                                var left = design_obj.left * scaleFactor;
                                                var width = design_obj.width * scaleFactor;
                                                var height = design_obj.height * scaleFactor;
                                                design_obj.top = design_obj.top * scaleFactor;
                                                design_obj.left = design_obj.left * scaleFactor;
                                                design_obj.width = design_obj.width * scaleFactor;
                                                design_obj.height = design_obj.height * scaleFactor;
                                            } else {
                                                if (window.innerWidth >= 320) {
                                                    scaleFactor = 1.8;
                                                } else {
                                                    scaleFactor = 2.3;
                                                }
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                        }
                                        if (design_obj.wInnerWidth < 360 && design_obj.wInnerWidth >= 320) {
                                            if (window.innerWidth >= 320) {
                                                scaleFactor = 2.3;
                                                var top = design_obj.top * scaleFactor;
                                                var left = design_obj.left * scaleFactor;
                                                var width = design_obj.width * scaleFactor;
                                                var height = design_obj.height * scaleFactor;
                                                design_obj.top = design_obj.top * scaleFactor;
                                                design_obj.left = design_obj.left * scaleFactor;
                                                design_obj.width = design_obj.width * scaleFactor;
                                                design_obj.height = design_obj.height * scaleFactor;
                                            } else {
                                                scaleFactor = 2.3;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                        }
                                        if (design_obj.wInnerWidth < 320) {
                                            scaleFactor = 3.4;
                                            var top = design_obj.top * scaleFactor;
                                            var left = design_obj.left * scaleFactor;
                                            var width = design_obj.width * scaleFactor;
                                            var height = design_obj.height * scaleFactor;
                                            design_obj.top = design_obj.top * scaleFactor;
                                            design_obj.left = design_obj.left * scaleFactor;
                                            design_obj.width = design_obj.width * scaleFactor;
                                            design_obj.height = design_obj.height * scaleFactor;
                                        }
                                    } else {
                                        if (design_obj.wInnerWidth != window.innerWidth) {
                                            if (window.innerWidth < 640 && window.innerWidth >= 480) {
                                                scaleFactor = 1.4;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                            if (window.innerWidth < 480 && window.innerWidth >= 360) {
                                                scaleFactor = 1.8;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                            if (window.innerWidth < 360 && window.innerWidth >= 320) {
                                                scaleFactor = 2.3;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                            if (window.innerWidth < 320) {
                                                scaleFactor = 3.4;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                        }
                                    }
                                    var top = design_obj.top;
                                    var left = design_obj.left;
                                    var type = design_obj.type;
                                    var price = design_obj.price;
                                    var image_id = design_obj.image_id;
                                    var image_id1 = '@' + design_obj.image_id;
                                    var object_id = i;
                                    var objFilters = design_obj.objFilters;
                                    var used_colors_old = design_obj.used_colors_old;
                                    var brush_path = design_obj.brush_path;
                                    var name = design_obj.name;
                                    var scalex = design_obj.scalex;
                                    var scaley = design_obj.scaley;
                                    var objWidth = design_obj.width;
                                    var objHeight = design_obj.height;
                                    var object_id = i;
                                    if (type == 'text' || type == 'group') {
                                        if (type == 'group') {
                                            var arcText = '';
                                            var arcObject = {};
                                            arcObject.textObj = design_obj.textObj;
                                            for (var i = 0; i < design_obj.textObj.objects.length; i++) {
                                                var newObj = design_obj.textObj.objects[i];
                                                if (newObj.type == 'text') {
                                                    arcText = arcText + design_obj.textObj.objects[i].text;
                                                    arcObject.textObj.fontFamily = design_obj.textObj.objects[0].fontFamily;
                                                    arcObject.textObj.fontWeight = design_obj.textObj.objects[0].fontWeight;
                                                    arcObject.textObj.fontStyle = design_obj.textObj.objects[0].fontStyle;
                                                    arcObject.textObj.textDecoration = design_obj.textObj.objects[0].textDecoration;
                                                    arcObject.textObj.fill = design_obj.textObj.objects[0].fill;
                                                    arcObject.textObj.textBackgroundColor = design_obj.textObj.objects[0].textBackgroundColor;
                                                    arcObject.textObj.textAlign = design_obj.textObj.objects[0].textAlign;
                                                    arcObject.textObj.stroke = design_obj.textObj.objects[0].stroke;
                                                    arcObject.textObj.strokeWidth = design_obj.textObj.objects[0].strokeWidth;
                                                    arcObject.textObj.shadow = design_obj.textObj.objects[0].shadow;
                                                    arcObject.textObj.shadow = design_obj.textObj.objects[0].shadow;
                                                }
                                            }
                                            arcObject.textObj.type = 'text';
                                            arcObject.textObj.tab = design_obj.tab ? design_obj.tab : "text";
                                            arcObject.textObj.name = design_obj.name ? design_obj.name : '';
                                            arcObject.textObj.designarea_id = design_obj.designarea_id;
                                            arcObject.textObj.mydesign = true;
                                            arcObject.textObj.image_side = design_obj.image_side;
                                            arcObject.textObj.image_id = '@' + design_obj.image_id;
                                            arcObject.textObj.arc = design_obj.arc;
                                            arcObject.textObj.arcObjText = arcText;
                                            arcObjects[i] = arcObject;
                                        } else {
                                            var text = design_obj.text;
                                            design_obj.textObj.tab = design_obj.tab ? design_obj.tab : "text";
                                            design_obj.textObj.name = design_obj.name ? design_obj.name : '';
                                            design_obj.textObj.designarea_id = design_obj.designarea_id;
                                            design_obj.textObj.mydesign = true;
                                            design_obj.textObj.image_side = design_obj.image_side;
                                            design_obj.textObj.image_id = '@' + design_obj.image_id;
                                            var textObject = new fabric.Text(text, design_obj.textObj);
                                            var cmd = new InsertCanvasObject(ProductDesigner.prototype, textObject);
                                            cmd.exec();
                                            History.prototype.push(cmd);
                                            jQuery('#pd_loading_img').show();
                                            flag++;
                                            if (total_objects == flag) {
                                                jQuery('#pd_loading_img').show();
                                                ProductDesigner.prototype.setzIndexes();
                                                jQuery('#pd_loading_img').show();
                                                setTimeout(function() {
                                                    jQuery('#pd_loading_img').show();
                                                    jQuery('.product-side-img').each(function(index, val) {
                                                        if (index != 0) jQuery('.product-side-img')[index].click();
                                                    }.bind(this));
                                                    jQuery('#pd_loading_img').show();
                                                    if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                        jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                    }
                                                    jQuery('#pd_loading_img').hide();
                                                    for (var key in LayersManager.prototype.layers) {
                                                        var obj = LayersManager.prototype.layers[key];
                                                        if (obj || obj != null) {
                                                            if (obj.type == 'text') {
                                                                ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                jQuery('#btn_left_align').click();
                                                                jQuery('#pd_loading_img').hide();
                                                            }
                                                        }
                                                    }
                                                }, 4000);
                                            }
                                        }
                                    } else {
                                        if (((design_obj.type == 'path-group') || (design_obj.type == 'path')) && (design_obj.name != 'brush')) {
                                            var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                            var objData = design_obj;
                                            var scalex = design_obj.scalex;
                                            var scaley = design_obj.scaley;
                                            var objTop = design_obj.top;
                                            var objLeft = design_obj.left;
                                            var objWidth = design_obj.width;
                                            var objHeight = design_obj.height;
                                            var angle = design_obj.angle;
                                            var obj_id = design_obj.obj_id;
                                            var image_id = design_obj.image_id;
                                            var obj_side = design_obj.obj_side;
                                            var used_colors = design_obj.used_colors;
                                            var used_colors_old = design_obj.used_colors_old;
                                            var textObject = designs[i];
                                            fabric.loadSVGFromURL(url, (function(objData) {
                                                return function(objects, options) {
                                                    var obj = fabric.util.groupSVGElements(objects, options);
                                                    obj.set({
                                                        top: objData.top,
                                                        left: objData.left,
                                                        width: objData.width,
                                                        height: objData.height,
                                                        scaleX: objData.scaleX,
                                                        scaleY: objData.scaleY,
                                                        angle: objData.angle,
                                                        tab: objData.tab,
                                                        image_id: objData.image_id,
                                                        obj_side: objData.obj_side,
                                                        obj_id: 'id_' + Date.now(),
                                                        image_side: objData.image_side,
                                                        image_id1: objData.image_id1,
                                                        resized_url: objData.url,
                                                        designarea_id: objData.designarea_id,
                                                        tab: objData.tab,
                                                        mydesign: true,
                                                        src: objData.src,
                                                        isScaleObj: true,
                                                        used_colors_old: objData.used_colors_old,
                                                    });
                                                    var cmd = new InsertCanvasObject(ProductDesigner.prototype, obj);
                                                    cmd.exec();
                                                    History.prototype.push(cmd);
                                                    jQuery('#pd_loading_img').show();
                                                    flag++;
                                                    if (total_objects == flag) {
                                                        jQuery('#pd_loading_img').show();
                                                        ProductDesigner.prototype.setzIndexes();
                                                        jQuery('#pd_loading_img').show();
                                                        setTimeout(function() {
                                                            jQuery('#pd_loading_img').show();
                                                            jQuery('.product-side-img').each(function(index, val) {
                                                                if (index != 0) jQuery('.product-side-img')[index].click();
                                                            }.bind(this));
                                                            jQuery('#pd_loading_img').show();
                                                            if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                                jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                            }
                                                            jQuery('#pd_loading_img').hide();
                                                            for (var key in LayersManager.prototype.layers) {
                                                                var obj = LayersManager.prototype.layers[key];
                                                                if (obj || obj != null) {
                                                                    if (obj.type == 'text') {
                                                                        ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                        jQuery('#btn_left_align').click();
                                                                        jQuery('#pd_loading_img').hide();
                                                                    }
                                                                }
                                                            }
                                                        }, 4000);
                                                    }
                                                }
                                            })({
                                                top: objTop,
                                                left: objLeft,
                                                width: objWidth,
                                                height: objHeight,
                                                scaleX: scalex,
                                                scaleY: scaley,
                                                angle: design_obj.angle,
                                                image_side: design_obj.image_side,
                                                image_id1: image_id1,
                                                resized_url: design_obj.url,
                                                designarea_id: design_obj.designarea_id,
                                                tab: design_obj.tab,
                                                mydesign: true,
                                                image_id: design_obj.image_id,
                                                obj_side: design_obj.obj_side,
                                                obj_id: 'id_' + Date.now(),
                                                src: url,
                                                isScaleObj: true,
                                                used_colors_old: used_colors_old,
                                            }));
                                            //}
                                        } else {
                                            var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                            var objData = design_obj;
                                            var scalex = design_obj.scalex;
                                            var scaley = design_obj.scaley;
                                            var objTop = design_obj.top;
                                            var objLeft = design_obj.left;
                                            var objWidth = design_obj.width;
                                            var objHeight = design_obj.height;
                                            var angle = design_obj.angle;
                                            var obj_id = design_obj.obj_id;
                                            var image_id = design_obj.image_id;
                                            var obj_side = design_obj.obj_side;
                                            var used_colors = design_obj.used_colors;
                                            var used_colors_old = design_obj.used_colors_old;
                                            var textObject = designs[i];
                                            var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                            fabric.Image.fromURL(url, (function(objData) {
                                                return function(obj) {
                                                    obj.set({
                                                        top: objData.top,
                                                        left: objData.left,
                                                        width: objData.width,
                                                        height: objData.height,
                                                        scaleX: objData.scaleX,
                                                        scaleY: objData.scaleY,
                                                        mydesign: true,
                                                        angle: objData.angle,
                                                        tab: objData.tab,
                                                        resized_url: design_obj.url,
                                                        image_id: '@' + objData.image_id,
                                                        designarea_id: objData.designarea_id,
                                                        obj_side: objData.obj_side,
                                                        image_side: objData.image_side,
                                                        obj_id: 'id_' + Date.now(),
                                                        src: objData.src,
                                                        isScaleObj: true,
                                                        used_colors_old: objData.used_colors_old,
                                                        textObj: objData.textObj,
                                                        objFilters: objData.objFilters
                                                    });
                                                    var cmd = new InsertCanvasObject(ProductDesigner.prototype, obj, false);
                                                    cmd.exec();
                                                    History.prototype.push(cmd);
                                                    jQuery('#pd_loading_img').show();
                                                    flag++;
                                                    if (total_objects == flag) {
                                                        jQuery('#pd_loading_img').show();
                                                        ProductDesigner.prototype.setzIndexes();
                                                        jQuery('#pd_loading_img').show();
                                                        setTimeout(function() {
                                                            jQuery('#pd_loading_img').show();
                                                            jQuery('.product-side-img').each(function(index, val) {
                                                                if (index != 0) jQuery('.product-side-img')[index].click();
                                                            }.bind(this));
                                                            jQuery('#pd_loading_img').show();
                                                            if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                                jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                            }
                                                            jQuery('#pd_loading_img').hide();
                                                            for (var key in LayersManager.prototype.layers) {
                                                                var obj = LayersManager.prototype.layers[key];
                                                                if (obj || obj != null) {
                                                                    if (obj.type == 'text') {
                                                                        ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                        jQuery('#btn_left_align').click();
                                                                        jQuery('#pd_loading_img').hide();
                                                                    }
                                                                }
                                                            }
                                                        }, 4000);
                                                    }
                                                }
                                            })({
                                                top: objTop,
                                                left: objLeft,
                                                width: objWidth,
                                                height: objHeight,
                                                scaleX: scalex,
                                                price: price,
                                                scaleY: scaley,
                                                angle: design_obj.angle,
                                                resized_url: design_obj.url,
                                                designarea_id: design_obj.designarea_id,
                                                mydesign: true,
                                                tab: design_obj.tab,
                                                obj_side: design_obj.obj_side,
                                                image_side: design_obj.image_side,
                                                obj_id: 'id_' + Date.now(),
                                                used_colors: design_obj.used_colors,
                                                isScaleObj: true,
                                                image_id: design_obj.image_id,
                                                src: url,
                                                textObj: design_obj.textObj,
                                                objFilters: design_obj.objFilters
                                            }));
                                        }
                                    }
                                }
                                if (arcText != '' && arcText != undefined) {
                                    for (key in arcObjects) {
                                        var textObject = new fabric.Text(arcObjects[key].textObj.arcObjText, arcObjects[key].textObj);
                                        var cmd = new InsertCanvasObject(ProductDesigner.prototype, textObject);
                                        cmd.exec();
                                        History.prototype.push(cmd);
                                        var currentArc = parseInt(jQuery('#text_arc').val());
                                        //var canvas = ProductDesigner.prototype.canvas;
                                        var canvas = ProductDesigner.prototype.containerCanvases[arcObjects[key].textObj.designarea_id];
                                        var defaultArc = arcObjects[key].textObj.arc ? arcObjects[key].textObj.arc : 0;
                                        cmd = new TextSpaceAngleChange(ProductDesigner.prototype, canvas, {
                                            arc: defaultArc
                                        }, {
                                            arc: currentArc
                                        });
                                        cmd.exec();
                                        History.prototype.push(cmd);
                                        flag++;
                                    }
                                }
                            } else {
                                jQuery('#pd_loading_img').hide();
                            }
                        }
                        ProductDesigner.prototype.observeCanvas();
                    }
                }.bind(this),
                onFailure: function() {
                    alert('Something is wrong... Please try again.');
                }
            });
        }
        if (this.isAdmin) {
            ProductDesigner.prototype.templateId = params.design;
        }
        if ((this.data.my_design_template_url != undefined) && (ProductDesigner.prototype.templateId != undefined)) {
            jQuery('#pd_loading_img').show();
            var data = {};
            data["shapes_category_id"] = ProductDesigner.prototype.templateId;
            jQuery.ajax({
                url: this.data.my_design_template_url,
                method: 'post',
                data: {
                    data: data
                },
                success: function(data, textStatus, jqXHR) {
                    var response = JSON.parse(data);
                    ProductDesigner.prototype.zIndexes = {};
                    if (response.design_id != null && response.design_id != '') {
                        var p_color = response.selected_product_color;
                        jQuery('.product-colors .color-img').each(function(index, val) {
                            if (val.getAttribute('data-color_id') == p_color) {
                                var color = val.getAttribute('data-color_id');
                                if (ProductDesigner.prototype.currentProductColor != color) {
                                    jQuery(val).addClass('selected');
                                    //index.up().addClassName('selected');
                                    ProductDesigner.product_default_color_id = val.getAttribute('data-color_id');
                                    ProductDesigner.prototype.changeProductColor(color, canvas);
                                    ProductDesigner.prototype._observeNavButtons('disabled');
                                }
                            }
                        });
                        jQuery('.product-side-img').each(function(index, val) {
                            if (index != 0) jQuery('.product-side-img')[index].click();
                            jQuery('#pd_loading_img').show();
                        }.bind(this));
                        jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                        jQuery('#pd_loading_img').show();
                        var designs = JSON.parse(response.designs);
                        var flag = 0;
                        var total_objects = Object.keys(designs).length;
                        var masking = JSON.parse(response.masking);
                        if (response.product_id == ProductDesigner.prototype.data.productId) {
                            var arcObjects = {};
                            for (var i in designs) {
                                var design_obj = designs[i];
                                var img_url = design_obj.url;
                                var tab = design_obj.tab;
                                var product_id = design_obj.product_id;
                                if (design_obj.wInnerWidth < 640 && design_obj.wInnerWidth != window.innerWidth) {
                                    if (design_obj.wInnerWidth < 640 && design_obj.wInnerWidth >= 480) {
                                        if (window.innerWidth >= 480) {
                                            scaleFactor = 1.4;
                                            var top = design_obj.top * scaleFactor;
                                            var left = design_obj.left * scaleFactor;
                                            var width = design_obj.width * scaleFactor;
                                            var height = design_obj.height * scaleFactor;
                                            design_obj.top = design_obj.top * scaleFactor;
                                            design_obj.left = design_obj.left * scaleFactor;
                                            design_obj.width = design_obj.width * scaleFactor;
                                            design_obj.height = design_obj.height * scaleFactor;
                                        } else {
                                            if (window.innerWidth > 360) {
                                                scaleFactor = 1.4;
                                            } else if (window.innerWidth >= 320) {
                                                scaleFactor = 1.8;
                                            } else {
                                                scaleFactor = 2.3;
                                            }
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                    }
                                    if (design_obj.wInnerWidth < 480 && design_obj.wInnerWidth >= 360) {
                                        if (window.innerWidth >= 360) {
                                            scaleFactor = 1.8;
                                            var top = design_obj.top * scaleFactor;
                                            var left = design_obj.left * scaleFactor;
                                            var width = design_obj.width * scaleFactor;
                                            var height = design_obj.height * scaleFactor;
                                            design_obj.top = design_obj.top * scaleFactor;
                                            design_obj.left = design_obj.left * scaleFactor;
                                            design_obj.width = design_obj.width * scaleFactor;
                                            design_obj.height = design_obj.height * scaleFactor;
                                        } else {
                                            if (window.innerWidth >= 320) {
                                                scaleFactor = 1.8;
                                            } else {
                                                scaleFactor = 2.3;
                                            }
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                    }
                                    if (design_obj.wInnerWidth < 360 && design_obj.wInnerWidth >= 320) {
                                        if (window.innerWidth >= 320) {
                                            scaleFactor = 2.3;
                                            var top = design_obj.top * scaleFactor;
                                            var left = design_obj.left * scaleFactor;
                                            var width = design_obj.width * scaleFactor;
                                            var height = design_obj.height * scaleFactor;
                                            design_obj.top = design_obj.top * scaleFactor;
                                            design_obj.left = design_obj.left * scaleFactor;
                                            design_obj.width = design_obj.width * scaleFactor;
                                            design_obj.height = design_obj.height * scaleFactor;
                                        } else {
                                            scaleFactor = 2.3;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                    }
                                    if (design_obj.wInnerWidth < 320) {
                                        scaleFactor = 3.4;
                                        var top = design_obj.top * scaleFactor;
                                        var left = design_obj.left * scaleFactor;
                                        var width = design_obj.width * scaleFactor;
                                        var height = design_obj.height * scaleFactor;
                                        design_obj.top = design_obj.top * scaleFactor;
                                        design_obj.left = design_obj.left * scaleFactor;
                                        design_obj.width = design_obj.width * scaleFactor;
                                        design_obj.height = design_obj.height * scaleFactor;
                                    }
                                } else {
                                    if (design_obj.wInnerWidth != window.innerWidth) {
                                        if (window.innerWidth < 640 && window.innerWidth >= 480) {
                                            scaleFactor = 1.4;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                        if (window.innerWidth < 480 && window.innerWidth >= 360) {
                                            scaleFactor = 1.8;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                        if (window.innerWidth < 360 && window.innerWidth >= 320) {
                                            scaleFactor = 2.3;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                        if (window.innerWidth < 320) {
                                            scaleFactor = 3.4;
                                            var top = design_obj.top / scaleFactor;
                                            var left = design_obj.left / scaleFactor;
                                            var width = design_obj.width / scaleFactor;
                                            var height = design_obj.height / scaleFactor;
                                            design_obj.top = design_obj.top / scaleFactor;
                                            design_obj.left = design_obj.left / scaleFactor;
                                            design_obj.width = design_obj.width / scaleFactor;
                                            design_obj.height = design_obj.height / scaleFactor;
                                        }
                                    }
                                }
                                var top = design_obj.top;
                                var left = design_obj.left;
                                var type = design_obj.type;
                                var price = design_obj.price;
                                var image_id = design_obj.image_id;
                                var image_id1 = '@' + design_obj.image_id;
                                var object_id = i;
                                var objFilters = design_obj.objFilters;
                                var used_colors_old = design_obj.used_colors_old;
                                var brush_path = design_obj.brush_path;
                                var name = design_obj.name;
                                var scalex = design_obj.scalex;
                                var scaley = design_obj.scaley;
                                var objWidth = design_obj.width;
                                var objHeight = design_obj.height;
                                var group_type = design_obj.group_type;
                                var last_row_size = design_obj.last_row_size;
                                if (type == 'text' || type == 'group') {
                                    if (type == 'group') {
                                        var arcText = '';
                                        var arcObject = {};
                                        arcObject.textObj = design_obj.textObj;
                                        for (var i = 0; i < design_obj.textObj.objects.length; i++) {
                                            var newObj = design_obj.textObj.objects[i];
                                            if (newObj.type == 'text') {
                                                arcText = arcText + design_obj.textObj.objects[i].text;
                                                arcObject.textObj.fontFamily = design_obj.textObj.objects[0].fontFamily;
                                                arcObject.textObj.fontWeight = design_obj.textObj.objects[0].fontWeight;
                                                arcObject.textObj.fontStyle = design_obj.textObj.objects[0].fontStyle;
                                                arcObject.textObj.textDecoration = design_obj.textObj.objects[0].textDecoration;
                                                arcObject.textObj.fill = design_obj.textObj.objects[0].fill;
                                                arcObject.textObj.textBackgroundColor = design_obj.textObj.objects[0].textBackgroundColor;
                                                arcObject.textObj.textAlign = design_obj.textObj.objects[0].textAlign;
                                                arcObject.textObj.stroke = design_obj.textObj.objects[0].stroke;
                                                arcObject.textObj.strokeWidth = design_obj.textObj.objects[0].strokeWidth;
                                                arcObject.textObj.shadow = design_obj.textObj.objects[0].shadow;
                                                arcObject.textObj.shadow = design_obj.textObj.objects[0].shadow;
                                            }
                                        }
                                        arcObject.textObj.type = 'text';
                                        arcObject.textObj.tab = design_obj.tab ? design_obj.tab : "text";
                                        arcObject.textObj.name = design_obj.name ? design_obj.name : '';
                                        arcObject.textObj.designarea_id = design_obj.designarea_id;
                                        arcObject.textObj.mydesign = true;
                                        arcObject.textObj.image_side = design_obj.image_side;
                                        arcObject.textObj.image_id = '@' + design_obj.image_id;
                                        arcObject.textObj.arc = design_obj.arc;
                                        arcObject.textObj.arcObjText = arcText;
                                        arcObjects[i] = arcObject;
                                    } else {
                                        var text = design_obj.text;
                                        design_obj.textObj.tab = design_obj.tab ? design_obj.tab : "text";
                                        design_obj.textObj.name = design_obj.name ? design_obj.name : '';
                                        design_obj.textObj.designarea_id = design_obj.designarea_id;
                                        design_obj.textObj.mydesign = true;
                                        design_obj.textObj.image_side = design_obj.image_side;
                                        design_obj.textObj.image_id = '@' + design_obj.image_id;
                                        var textObject = new fabric.Text(text, design_obj.textObj);
                                        textObject.set({
                                            group_type: group_type,
                                            last_row_size: last_row_size,
                                        })
                                        var cmd = new InsertCanvasObject(ProductDesigner.prototype, textObject);
                                        ProductDesigner.prototype.zIndexes[textObject.obj_id] = design_obj.zIndex;
                                        cmd.exec();
                                        History.prototype.push(cmd);
                                        jQuery('#pd_loading_img').show();
                                        flag++;
                                        if (total_objects == flag) {
                                            jQuery('#pd_loading_img').show();
                                            ProductDesigner.prototype.setzIndexes();
                                            jQuery('#pd_loading_img').show();
                                            setTimeout(function() {
                                                jQuery('#pd_loading_img').show();
                                                jQuery('.product-side-img').each(function(index, val) {
                                                    if (index != 0) jQuery('.product-side-img')[index].click();
                                                }.bind(this));
                                                jQuery('#pd_loading_img').show();
                                                if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                    jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                }
                                                jQuery('#pd_loading_img').hide();
                                                for (var key in LayersManager.prototype.layers) {
                                                    var obj = LayersManager.prototype.layers[key];
                                                    if (obj || obj != null) {
                                                        if (obj.type == 'text') {
                                                            ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                            jQuery('#btn_left_align').click();
                                                            jQuery('#pd_loading_img').hide();
                                                        }
                                                    }
                                                }
                                            }, 4000);
                                        }
                                    }
                                } else {
                                    if (((design_obj.type == 'path-group') || (design_obj.type == 'path')) && (design_obj.name != 'brush')) {
                                        var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                        var objData = design_obj;
                                        var scalex = design_obj.scalex;
                                        var scaley = design_obj.scaley;
                                        var objTop = design_obj.top;
                                        var objLeft = design_obj.left;
                                        var objWidth = design_obj.width;
                                        var objHeight = design_obj.height;
                                        var angle = design_obj.angle;
                                        var obj_id = design_obj.obj_id;
                                        var image_id = design_obj.image_id;
                                        var obj_side = design_obj.obj_side;
                                        var used_colors = design_obj.used_colors;
                                        var used_colors_old = design_obj.used_colors_old;
                                        var textObject = designs[i];
                                        fabric.loadSVGFromURL(url, (function(objData) {
                                            return function(objects, options) {
                                                var obj = fabric.util.groupSVGElements(objects, options);
                                                obj.set({
                                                    top: objData.top,
                                                    left: objData.left,
                                                    width: objData.width,
                                                    height: objData.height,
                                                    scaleX: objData.scaleX,
                                                    scaleY: objData.scaleY,
                                                    angle: objData.angle,
                                                    tab: objData.tab,
                                                    image_id: objData.image_id,
                                                    obj_side: objData.obj_side,
                                                    obj_id: 'id_' + Date.now(),
                                                    image_side: objData.image_side,
                                                    image_id1: objData.image_id1,
                                                    resized_url: objData.url,
                                                    designarea_id: objData.designarea_id,
                                                    tab: objData.tab,
                                                    mydesign: true,
                                                    src: objData.src,
                                                    isScaleObj: true,
                                                    used_colors_old: objData.used_colors_old,
                                                });
                                                var cmd = new InsertCanvasObject(ProductDesigner.prototype, obj);
                                                ProductDesigner.prototype.zIndexes[obj.obj_id] = objData.zIndex;
                                                cmd.exec();
                                                History.prototype.push(cmd);
                                                jQuery('#pd_loading_img').show();
                                                flag++;
                                                if (total_objects == flag) {
                                                    jQuery('#pd_loading_img').show();
                                                    ProductDesigner.prototype.setzIndexes();
                                                    jQuery('#pd_loading_img').show();
                                                    setTimeout(function() {
                                                        jQuery('#pd_loading_img').show();
                                                        jQuery('.product-side-img').each(function(index, val) {
                                                            if (index != 0) jQuery('.product-side-img')[index].click();
                                                        }.bind(this));
                                                        jQuery('#pd_loading_img').show();
                                                        if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                            jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                        }
                                                        jQuery('#pd_loading_img').hide();
                                                        for (var key in LayersManager.prototype.layers) {
                                                            var obj = LayersManager.prototype.layers[key];
                                                            if (obj || obj != null) {
                                                                if (obj.type == 'text') {
                                                                    ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                    jQuery('#btn_left_align').click();
                                                                    jQuery('#pd_loading_img').hide();
                                                                }
                                                            }
                                                        }
                                                    }, 4000);
                                                }
                                            }
                                        })({
                                            top: objTop,
                                            left: objLeft,
                                            width: objWidth,
                                            height: objHeight,
                                            scaleX: scalex,
                                            scaleY: scaley,
                                            angle: design_obj.angle,
                                            image_side: design_obj.image_side,
                                            image_id1: image_id1,
                                            zIndex: design_obj.zIndex,
                                            resized_url: design_obj.url,
                                            designarea_id: design_obj.designarea_id,
                                            tab: design_obj.tab,
                                            mydesign: true,
                                            image_id: design_obj.image_id,
                                            obj_side: design_obj.obj_side,
                                            obj_id: 'id_' + Date.now(),
                                            src: url,
                                            isScaleObj: true,
                                            used_colors_old: used_colors_old,
                                        }));
                                        //}
                                    } else {
                                        var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                        var objData = design_obj;
                                        var scalex = design_obj.scalex;
                                        var scaley = design_obj.scaley;
                                        var objTop = design_obj.top;
                                        var objLeft = design_obj.left;
                                        var objWidth = design_obj.width;
                                        var objHeight = design_obj.height;
                                        var angle = design_obj.angle;
                                        var obj_id = design_obj.obj_id;
                                        var image_id = design_obj.image_id;
                                        var obj_side = design_obj.obj_side;
                                        var used_colors = design_obj.used_colors;
                                        var used_colors_old = design_obj.used_colors_old;
                                        var textObject = designs[i];
                                        var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                        fabric.Image.fromURL(url, (function(objData) {
                                            return function(obj) {
                                                obj.set({
                                                    top: objData.top,
                                                    left: objData.left,
                                                    width: objData.width,
                                                    height: objData.height,
                                                    scaleX: objData.scaleX,
                                                    scaleY: objData.scaleY,
                                                    mydesign: true,
                                                    angle: objData.angle,
                                                    tab: objData.tab,
                                                    resized_url: design_obj.url,
                                                    image_id: '@' + objData.image_id,
                                                    designarea_id: objData.designarea_id,
                                                    obj_side: objData.obj_side,
                                                    image_side: objData.image_side,
                                                    obj_id: 'id_' + Date.now(),
                                                    src: objData.src,
                                                    isScaleObj: true,
                                                    used_colors_old: objData.used_colors_old,
                                                    textObj: objData.textObj,
                                                    objFilters: objData.objFilters
                                                });
                                                var cmd = new InsertCanvasObject(ProductDesigner.prototype, obj, false);
                                                ProductDesigner.prototype.zIndexes[obj.obj_id] = objData.zIndex;
                                                cmd.exec();
                                                History.prototype.push(cmd);
                                                jQuery('#pd_loading_img').show();
                                                flag++;
                                                if (total_objects == flag) {
                                                    jQuery('#pd_loading_img').show();
                                                    ProductDesigner.prototype.setzIndexes();
                                                    jQuery('#pd_loading_img').show();
                                                    setTimeout(function() {
                                                        jQuery('#pd_loading_img').show();
                                                        jQuery('.product-side-img').each(function(index, val) {
                                                            if (index != 0) jQuery('.product-side-img')[index].click();
                                                        }.bind(this));
                                                        jQuery('#pd_loading_img').show();
                                                        if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                            jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                        }
                                                        jQuery('#pd_loading_img').hide();
                                                        for (var key in LayersManager.prototype.layers) {
                                                            var obj = LayersManager.prototype.layers[key];
                                                            if (obj || obj != null) {
                                                                if (obj.type == 'text') {
                                                                    ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                    jQuery('#btn_left_align').click();
                                                                    jQuery('#pd_loading_img').hide();
                                                                }
                                                            }
                                                        }
                                                    }, 4000);
                                                }
                                            }
                                        })({
                                            top: objTop,
                                            left: objLeft,
                                            width: objWidth,
                                            height: objHeight,
                                            scaleX: scalex,
                                            price: price,
                                            scaleY: scaley,
                                            angle: design_obj.angle,
                                            resized_url: design_obj.url,
                                            designarea_id: design_obj.designarea_id,
                                            mydesign: true,
                                            zIndex: design_obj.zIndex,
                                            tab: design_obj.tab,
                                            obj_side: design_obj.obj_side,
                                            image_side: design_obj.image_side,
                                            obj_id: 'id_' + Date.now(),
                                            used_colors: design_obj.used_colors,
                                            isScaleObj: true,
                                            image_id: design_obj.image_id,
                                            src: url,
                                            textObj: design_obj.textObj,
                                            objFilters: design_obj.objFilters
                                        }));
                                    }
                                }
                            }
                            if (arcText != '' && arcText != undefined) {
                                for (key in arcObjects) {
                                    var textObject = new fabric.Text(arcObjects[key].textObj.arcObjText, arcObjects[key].textObj);
                                    var cmd = new InsertCanvasObject(ProductDesigner.prototype, textObject);
                                    cmd.exec();
                                    History.prototype.push(cmd);
                                    var currentArc = parseInt(jQuery('#text_arc').val());
                                    //var canvas = window.ProductDesigner.canvas;
                                    var canvas = ProductDesigner.prototype.containerCanvases[arcObjects[key].textObj.designarea_id];
                                    var defaultArc = arcObjects[key].textObj.arc ? arcObjects[key].textObj.arc : 0;
                                    cmd = new TextSpaceAngleChange(ProductDesigner.prototype, canvas, {
                                        arc: defaultArc
                                    }, {
                                        arc: currentArc
                                    });
                                    cmd.exec();
                                    History.prototype.push(cmd);
                                    flag++;
                                }
                            }
                            for (var i in masking) {
                                var canvas = ProductDesigner.prototype.containerCanvases[i];
                                var url = ProductDesigner.prototype.mediaUrl + masking[i].url;
                                var DesignId = i;
                                fabric.loadSVGFromURL(url, (function(objData) {
                                    return function(objects, options) {
                                        var canvas = objData.Canvas;
                                        var url = objData.Url;
                                        var DesignId = objData.design_id;
                                        var cmd = new ObjectMaskingHistory(canvas, objects, options, url, DesignId);
                                        cmd.exec();
                                        History.prototype.push(cmd);
                                    }
                                })({
                                    Canvas: canvas,
                                    Url: url,
                                    design_id: DesignId,
                                }));
                            }
                        } else {
                            var r = confirm('This design is not made for this product, Do You want to continue?');
                            if (r == true) {
                                var arcObjects = {};
                                for (var i in designs) {
                                    var design_obj = designs[i];
                                    var img_url = design_obj.url;
                                    var tab = design_obj.tab;
                                    var product_id = design_obj.product_id;
                                    if (design_obj.wInnerWidth < 640 && design_obj.wInnerWidth != window.innerWidth) {
                                        if (design_obj.wInnerWidth < 640 && design_obj.wInnerWidth >= 480) {
                                            if (window.innerWidth >= 480) {
                                                scaleFactor = 1.4;
                                                var top = design_obj.top * scaleFactor;
                                                var left = design_obj.left * scaleFactor;
                                                var width = design_obj.width * scaleFactor;
                                                var height = design_obj.height * scaleFactor;
                                                design_obj.top = design_obj.top * scaleFactor;
                                                design_obj.left = design_obj.left * scaleFactor;
                                                design_obj.width = design_obj.width * scaleFactor;
                                                design_obj.height = design_obj.height * scaleFactor;
                                            } else {
                                                if (window.innerWidth > 360) {
                                                    scaleFactor = 1.4;
                                                } else if (window.innerWidth >= 320) {
                                                    scaleFactor = 1.8;
                                                } else {
                                                    scaleFactor = 2.3;
                                                }
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                        }
                                        if (design_obj.wInnerWidth < 480 && design_obj.wInnerWidth >= 360) {
                                            if (window.innerWidth >= 360) {
                                                scaleFactor = 1.8;
                                                var top = design_obj.top * scaleFactor;
                                                var left = design_obj.left * scaleFactor;
                                                var width = design_obj.width * scaleFactor;
                                                var height = design_obj.height * scaleFactor;
                                                design_obj.top = design_obj.top * scaleFactor;
                                                design_obj.left = design_obj.left * scaleFactor;
                                                design_obj.width = design_obj.width * scaleFactor;
                                                design_obj.height = design_obj.height * scaleFactor;
                                            } else {
                                                if (window.innerWidth >= 320) {
                                                    scaleFactor = 1.8;
                                                } else {
                                                    scaleFactor = 2.3;
                                                }
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                        }
                                        if (design_obj.wInnerWidth < 360 && design_obj.wInnerWidth >= 320) {
                                            if (window.innerWidth >= 320) {
                                                scaleFactor = 2.3;
                                                var top = design_obj.top * scaleFactor;
                                                var left = design_obj.left * scaleFactor;
                                                var width = design_obj.width * scaleFactor;
                                                var height = design_obj.height * scaleFactor;
                                                design_obj.top = design_obj.top * scaleFactor;
                                                design_obj.left = design_obj.left * scaleFactor;
                                                design_obj.width = design_obj.width * scaleFactor;
                                                design_obj.height = design_obj.height * scaleFactor;
                                            } else {
                                                scaleFactor = 2.3;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                        }
                                        if (design_obj.wInnerWidth < 320) {
                                            scaleFactor = 3.4;
                                            var top = design_obj.top * scaleFactor;
                                            var left = design_obj.left * scaleFactor;
                                            var width = design_obj.width * scaleFactor;
                                            var height = design_obj.height * scaleFactor;
                                            design_obj.top = design_obj.top * scaleFactor;
                                            design_obj.left = design_obj.left * scaleFactor;
                                            design_obj.width = design_obj.width * scaleFactor;
                                            design_obj.height = design_obj.height * scaleFactor;
                                        }
                                    } else {
                                        if (design_obj.wInnerWidth != window.innerWidth) {
                                            if (window.innerWidth < 640 && window.innerWidth >= 480) {
                                                scaleFactor = 1.4;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                            if (window.innerWidth < 480 && window.innerWidth >= 360) {
                                                scaleFactor = 1.8;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                            if (window.innerWidth < 360 && window.innerWidth >= 320) {
                                                scaleFactor = 2.3;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                            if (window.innerWidth < 320) {
                                                scaleFactor = 3.4;
                                                var top = design_obj.top / scaleFactor;
                                                var left = design_obj.left / scaleFactor;
                                                var width = design_obj.width / scaleFactor;
                                                var height = design_obj.height / scaleFactor;
                                                design_obj.top = design_obj.top / scaleFactor;
                                                design_obj.left = design_obj.left / scaleFactor;
                                                design_obj.width = design_obj.width / scaleFactor;
                                                design_obj.height = design_obj.height / scaleFactor;
                                            }
                                        }
                                    }
                                    var top = design_obj.top;
                                    var left = design_obj.left;
                                    var type = design_obj.type;
                                    var price = design_obj.price;
                                    var image_id = design_obj.image_id;
                                    var image_id1 = '@' + design_obj.image_id;
                                    var object_id = i;
                                    var objFilters = design_obj.objFilters;
                                    var used_colors_old = design_obj.used_colors_old;
                                    var brush_path = design_obj.brush_path;
                                    var name = design_obj.name;
                                    var scalex = design_obj.scalex;
                                    var scaley = design_obj.scaley;
                                    var objWidth = design_obj.width;
                                    var objHeight = design_obj.height;
                                    var object_id = i;
                                    if (type == 'text' || type == 'group') {
                                        if (type == 'group') {
                                            var arcText = '';
                                            var arcObject = {};
                                            arcObject.textObj = design_obj.textObj;
                                            for (var i = 0; i < design_obj.textObj.objects.length; i++) {
                                                var newObj = design_obj.textObj.objects[i];
                                                if (newObj.type == 'text') {
                                                    arcText = arcText + design_obj.textObj.objects[i].text;
                                                    arcObject.textObj.fontFamily = design_obj.textObj.objects[0].fontFamily;
                                                    arcObject.textObj.fontWeight = design_obj.textObj.objects[0].fontWeight;
                                                    arcObject.textObj.fontStyle = design_obj.textObj.objects[0].fontStyle;
                                                    arcObject.textObj.textDecoration = design_obj.textObj.objects[0].textDecoration;
                                                    arcObject.textObj.fill = design_obj.textObj.objects[0].fill;
                                                    arcObject.textObj.textBackgroundColor = design_obj.textObj.objects[0].textBackgroundColor;
                                                    arcObject.textObj.textAlign = design_obj.textObj.objects[0].textAlign;
                                                    arcObject.textObj.stroke = design_obj.textObj.objects[0].stroke;
                                                    arcObject.textObj.strokeWidth = design_obj.textObj.objects[0].strokeWidth;
                                                    arcObject.textObj.shadow = design_obj.textObj.objects[0].shadow;
                                                    arcObject.textObj.shadow = design_obj.textObj.objects[0].shadow;
                                                }
                                            }
                                            arcObject.textObj.type = 'text';
                                            arcObject.textObj.tab = design_obj.tab ? design_obj.tab : "text";
                                            arcObject.textObj.name = design_obj.name ? design_obj.name : '';
                                            arcObject.textObj.designarea_id = design_obj.designarea_id;
                                            arcObject.textObj.mydesign = true;
                                            arcObject.textObj.image_side = design_obj.image_side;
                                            arcObject.textObj.image_id = '@' + design_obj.image_id;
                                            arcObject.textObj.arc = design_obj.arc;
                                            arcObject.textObj.arcObjText = arcText;
                                            arcObjects[i] = arcObject;
                                        } else {
                                            var text = design_obj.text;
                                            design_obj.textObj.tab = design_obj.tab ? design_obj.tab : "text";
                                            design_obj.textObj.name = design_obj.name ? design_obj.name : '';
                                            design_obj.textObj.designarea_id = design_obj.designarea_id;
                                            design_obj.textObj.mydesign = true;
                                            design_obj.textObj.image_side = design_obj.image_side;
                                            design_obj.textObj.image_id = '@' + design_obj.image_id;
                                            var textObject = new fabric.Text(text, design_obj.textObj);
                                            var cmd = new InsertCanvasObject(ProductDesigner.prototype, textObject);
                                            cmd.exec();
                                            History.prototype.push(cmd);
                                            jQuery('#pd_loading_img').show();
                                            flag++;
                                            if (total_objects == flag) {
                                                jQuery('#pd_loading_img').show();
                                                ProductDesigner.prototype.setzIndexes();
                                                jQuery('#pd_loading_img').show();
                                                setTimeout(function() {
                                                    jQuery('#pd_loading_img').show();
                                                    jQuery('.product-side-img').each(function(index, val) {
                                                        if (index != 0) jQuery('.product-side-img')[index].click();
                                                    }.bind(this));
                                                    jQuery('#pd_loading_img').show();
                                                    if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                        jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                    }
                                                    jQuery('#pd_loading_img').hide();
                                                    for (var key in LayersManager.prototype.layers) {
                                                        var obj = LayersManager.prototype.layers[key];
                                                        if (obj || obj != null) {
                                                            if (obj.type == 'text') {
                                                                ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                jQuery('#btn_left_align').click();
                                                                jQuery('#pd_loading_img').hide();
                                                            }
                                                        }
                                                    }
                                                }, 4000);
                                            }
                                        }
                                    } else {
                                        if (((design_obj.type == 'path-group') || (design_obj.type == 'path')) && (design_obj.name != 'brush')) {
                                            var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                            var objData = design_obj;
                                            var scalex = design_obj.scalex;
                                            var scaley = design_obj.scaley;
                                            var objTop = design_obj.top;
                                            var objLeft = design_obj.left;
                                            var objWidth = design_obj.width;
                                            var objHeight = design_obj.height;
                                            var angle = design_obj.angle;
                                            var obj_id = design_obj.obj_id;
                                            var image_id = design_obj.image_id;
                                            var obj_side = design_obj.obj_side;
                                            var used_colors = design_obj.used_colors;
                                            var used_colors_old = design_obj.used_colors_old;
                                            var textObject = designs[i];
                                            fabric.loadSVGFromURL(url, (function(objData) {
                                                return function(objects, options) {
                                                    var obj = fabric.util.groupSVGElements(objects, options);
                                                    obj.set({
                                                        top: objData.top,
                                                        left: objData.left,
                                                        width: objData.width,
                                                        height: objData.height,
                                                        scaleX: objData.scaleX,
                                                        scaleY: objData.scaleY,
                                                        angle: objData.angle,
                                                        tab: objData.tab,
                                                        image_id: objData.image_id,
                                                        obj_side: objData.obj_side,
                                                        obj_id: 'id_' + Date.now(),
                                                        image_side: objData.image_side,
                                                        image_id1: objData.image_id1,
                                                        resized_url: objData.url,
                                                        designarea_id: objData.designarea_id,
                                                        tab: objData.tab,
                                                        mydesign: true,
                                                        src: objData.src,
                                                        isScaleObj: true,
                                                        used_colors_old: objData.used_colors_old,
                                                    });
                                                    var cmd = new InsertCanvasObject(ProductDesigner.prototype, obj);
                                                    cmd.exec();
                                                    History.prototype.push(cmd);
                                                    jQuery('#pd_loading_img').show();
                                                    flag++;
                                                    if (total_objects == flag) {
                                                        jQuery('#pd_loading_img').show();
                                                        ProductDesigner.prototype.setzIndexes();
                                                        jQuery('#pd_loading_img').show();
                                                        setTimeout(function() {
                                                            jQuery('#pd_loading_img').show();
                                                            jQuery('.product-side-img').each(function(index, val) {
                                                                if (index != 0) jQuery('.product-side-img')[index].click();
                                                            }.bind(this));
                                                            jQuery('#pd_loading_img').show();
                                                            if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                                jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                            }
                                                            jQuery('#pd_loading_img').hide();
                                                            for (var key in LayersManager.prototype.layers) {
                                                                var obj = LayersManager.prototype.layers[key];
                                                                if (obj || obj != null) {
                                                                    if (obj.type == 'text') {
                                                                        ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                        jQuery('#btn_left_align').click();
                                                                        jQuery('#pd_loading_img').hide();
                                                                    }
                                                                }
                                                            }
                                                        }, 4000);
                                                    }
                                                }
                                            })({
                                                top: objTop,
                                                left: objLeft,
                                                width: objWidth,
                                                height: objHeight,
                                                scaleX: scalex,
                                                scaleY: scaley,
                                                angle: design_obj.angle,
                                                image_side: design_obj.image_side,
                                                image_id1: image_id1,
                                                resized_url: design_obj.url,
                                                designarea_id: design_obj.designarea_id,
                                                tab: design_obj.tab,
                                                mydesign: true,
                                                image_id: design_obj.image_id,
                                                obj_side: design_obj.obj_side,
                                                obj_id: 'id_' + Date.now(),
                                                src: url,
                                                isScaleObj: true,
                                                used_colors_old: used_colors_old,
                                            }));
                                            //}
                                        } else {
                                            var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                            var objData = design_obj;
                                            var scalex = design_obj.scalex;
                                            var scaley = design_obj.scaley;
                                            var objTop = design_obj.top;
                                            var objLeft = design_obj.left;
                                            var objWidth = design_obj.width;
                                            var objHeight = design_obj.height;
                                            var angle = design_obj.angle;
                                            var obj_id = design_obj.obj_id;
                                            var image_id = design_obj.image_id;
                                            var obj_side = design_obj.obj_side;
                                            var used_colors = design_obj.used_colors;
                                            var used_colors_old = design_obj.used_colors_old;
                                            var textObject = designs[i];
                                            var url = ProductDesigner.prototype.mediaUrl + design_obj.url;
                                            fabric.Image.fromURL(url, (function(objData) {
                                                return function(obj) {
                                                    obj.set({
                                                        top: objData.top,
                                                        left: objData.left,
                                                        width: objData.width,
                                                        height: objData.height,
                                                        scaleX: objData.scaleX,
                                                        scaleY: objData.scaleY,
                                                        mydesign: true,
                                                        angle: objData.angle,
                                                        tab: objData.tab,
                                                        resized_url: design_obj.url,
                                                        image_id: '@' + objData.image_id,
                                                        designarea_id: objData.designarea_id,
                                                        obj_side: objData.obj_side,
                                                        image_side: objData.image_side,
                                                        obj_id: 'id_' + Date.now(),
                                                        src: objData.src,
                                                        isScaleObj: true,
                                                        used_colors_old: objData.used_colors_old,
                                                        textObj: objData.textObj,
                                                        objFilters: objData.objFilters
                                                    });
                                                    var cmd = new InsertCanvasObject(ProductDesigner.prototype, obj, false);
                                                    cmd.exec();
                                                    History.prototype.push(cmd);
                                                    jQuery('#pd_loading_img').show();
                                                    flag++;
                                                    if (total_objects == flag) {
                                                        jQuery('#pd_loading_img').show();
                                                        ProductDesigner.prototype.setzIndexes();
                                                        jQuery('#pd_loading_img').show();
                                                        setTimeout(function() {
                                                            jQuery('#pd_loading_img').show();
                                                            jQuery('.product-side-img').each(function(index, val) {
                                                                if (index != 0) jQuery('.product-side-img')[index].click();
                                                            }.bind(this));
                                                            jQuery('#pd_loading_img').show();
                                                            if (jQuery('#product-sides')[0].children[1].children[1] != undefined) {
                                                                jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                                                            }
                                                            jQuery('#pd_loading_img').hide();
                                                            for (var key in LayersManager.prototype.layers) {
                                                                var obj = LayersManager.prototype.layers[key];
                                                                if (obj || obj != null) {
                                                                    if (obj.type == 'text') {
                                                                        ProductDesigner.prototype.canvas.setActiveObject(obj);
                                                                        jQuery('#btn_left_align').click();
                                                                        jQuery('#pd_loading_img').hide();
                                                                    }
                                                                }
                                                            }
                                                        }, 4000);
                                                    }
                                                }
                                            })({
                                                top: objTop,
                                                left: objLeft,
                                                width: objWidth,
                                                height: objHeight,
                                                scaleX: scalex,
                                                price: price,
                                                scaleY: scaley,
                                                angle: design_obj.angle,
                                                resized_url: design_obj.url,
                                                designarea_id: design_obj.designarea_id,
                                                mydesign: true,
                                                tab: design_obj.tab,
                                                obj_side: design_obj.obj_side,
                                                image_side: design_obj.image_side,
                                                obj_id: 'id_' + Date.now(),
                                                used_colors: design_obj.used_colors,
                                                isScaleObj: true,
                                                image_id: design_obj.image_id,
                                                src: url,
                                                textObj: design_obj.textObj,
                                                objFilters: design_obj.objFilters
                                            }));
                                        }
                                    }
                                }
                                if (arcText != '' && arcText != undefined) {
                                    for (key in arcObjects) {
                                        var textObject = new fabric.Text(arcObjects[key].textObj.arcObjText, arcObjects[key].textObj);
                                        var cmd = new InsertCanvasObject(ProductDesigner.prototype, textObject);
                                        cmd.exec();
                                        History.prototype.push(cmd);
                                        var currentArc = parseInt(jQuery('#text_arc').val());
                                        //var canvas = window.ProductDesigner.canvas;
                                        var canvas = ProductDesigner.prototype.containerCanvases[arcObjects[key].textObj.designarea_id];
                                        var defaultArc = arcObjects[key].textObj.arc ? arcObjects[key].textObj.arc : 0;
                                        cmd = new TextSpaceAngleChange(ProductDesigner.prototype, canvas, {
                                            arc: defaultArc
                                        }, {
                                            arc: currentArc
                                        });
                                        cmd.exec();
                                        History.prototype.push(cmd);
                                        flag++;
                                    }
                                }
                            } else {
                                jQuery('#pd_loading_img').hide();
                            }
                        }
                        ProductDesigner.prototype.observeCanvas();
                    }
                }.bind(this),
                onFailure: function() {
                    alert('Something is wrong... Please try again.');
                }
            });
        }
    },
    setDesignArea: function(prod, selection_Area) {
        if (typeof prod === 'undefined') {
            return;
        }
        ProductDesigner.prototype.product_container.style.height = parseInt(prod.height) + 'px';
        ProductDesigner.prototype.product_container.style.width = parseInt(prod.width) + 'px';
        ProductDesigner.prototype.product_container.style.background = 'url(' + prod.url + ') no-repeat center';
        if (prod.dim.length == undefined) {
            if (typeof ProductDesigner.prototype.product_container_layers['@' + prod.image_id + '&' + prod.designArea_id] === 'undefined') {
                var designArea = document.createElement('div');
                designArea.setAttribute('class', 'design-container');
                designArea.setAttribute('id', 'designArea-' + prod.image_id);
                designArea.style.position = 'absolute';
                designArea.style.marginLeft = prod.dim.x1 + 'px';
                designArea.style.marginTop = prod.dim.y1 + 'px';
                designArea.style.width = prod.dim.width + 'px';
                designArea.style.height = prod.dim.height + 'px';
                designArea.style.border = '1px dashed';
                designArea.style.zIndex = '1000';
                designArea.setAttribute('selection_area', '@' + prod.image_id + '&' + prod.designArea_id);
                designArea.setAttribute('designAreaId', prod.designArea_id);
                // designArea.style.border = '2px dashed';
                designArea.style.borderColor = "red";
                var canvas = document.createElement('canvas');
                canvas.setAttribute('class', 'canvas-panel');
                canvas.setAttribute('width', prod.dim.width);
                canvas.setAttribute('height', prod.dim.height);
                canvas.setAttribute('canvas_id', 'canvasid_' + Date.now());
                designArea.appendChild(canvas);
                ProductDesigner.prototype.product_container.appendChild(designArea);
                ProductDesigner.prototype.designArea = designArea;
                ProductDesigner.prototype.canvas = new fabric.Canvas(canvas);
                ProductDesigner.prototype.canvas.selection = false;
                ProductDesigner.prototype.containerCanvases['@' + prod.image_id + '&' + prod.designArea_id] = ProductDesigner.prototype.canvas;
                ProductDesigner.prototype.currentImageSide = prod.image_side;
                this.observeCanvas();
                //ProductDesigner.prototype.currentImageSideArea[prod.designArea_id] = prod.image_side_area[0];
                ProductDesigner.prototype.ImageMultipleArray['@' + prod.image_id] = false;
            } else {
                var designArea = ProductDesigner.prototype.product_container_layers['@' + prod.image_id + '&' + prod.designArea_id];
                ProductDesigner.prototype.product_container.appendChild(designArea);
                ProductDesigner.prototype.designArea = designArea;
                ProductDesigner.prototype.canvas = ProductDesigner.prototype.containerCanvases['@' + prod.image_id + '&' + prod.designArea_id];
                ProductDesigner.prototype.canvas.selection = false;
                //active canvas for the brush
                for (var index in ProductDesigner.prototype.containerCanvases) {
                    var canvas = ProductDesigner.prototype.containerCanvases[index];
                    canvas.isDrawingMode = false;
                }
            }
            ProductDesigner.prototype.currentProduct = '@' + prod.image_id;
            ProductDesigner.prototype.currentDesignArea = '@' + prod.image_id + '&' + prod.designArea_id;
            ProductDesigner.prototype.currentDesignAreaId = prod.designArea_id;
        } else {
            for (var i = 0; i < prod.dim.length; i++) {
                if (typeof ProductDesigner.prototype.product_container_layers['@' + prod.image_id + '&' + prod.dim[i].design_area_id] === 'undefined') {
                    var dynamicVarName = i;
                    window['designArea' + dynamicVarName] = document.createElement('div');
                    window['designArea' + dynamicVarName].setAttribute('class', 'design-container');
                    window['designArea' + dynamicVarName].setAttribute('id', 'designArea-' + prod.image_id + prod.dim[i].design_area_id);
                    window['designArea' + dynamicVarName].style.position = 'absolute';
                    window['designArea' + dynamicVarName].style.marginLeft = prod.dim[i].x1 + 'px';
                    window['designArea' + dynamicVarName].style.marginTop = prod.dim[i].y1 + 'px';
                    window['designArea' + dynamicVarName].style.width = prod.dim[i].width + 'px';
                    window['designArea' + dynamicVarName].style.height = prod.dim[i].height + 'px';
                    window['designArea' + dynamicVarName].style.border = '1px dashed';
                    window['designArea' + dynamicVarName].style.zIndex = '1000';
                    window['designArea' + dynamicVarName].setAttribute('selection_area', '@' + prod.image_id + '&' + prod.dim[i].design_area_id);
                    window['designArea' + dynamicVarName].setAttribute('designAreaId', prod.dim[i].design_area_id);
                    window['designArea' + dynamicVarName].setAttribute('image_id', '@' + prod.image_id);
                    window['canvas' + dynamicVarName] = document.createElement('canvas');
                    window['canvas' + dynamicVarName].setAttribute('class', 'canvas-panel');
                    window['canvas' + dynamicVarName].setAttribute('width', prod.dim[i].width);
                    window['canvas' + dynamicVarName].setAttribute('height', prod.dim[i].height);
                    window['canvas' + dynamicVarName].setAttribute('canvas_id', 'canvasid_' + Date.now());
                    window['designArea' + dynamicVarName].appendChild(window['canvas' + dynamicVarName]);
                    ProductDesigner.prototype.product_container.appendChild(window['designArea' + dynamicVarName]);
                    this.designArea = window['designArea' + dynamicVarName];
                    ProductDesigner.prototype.canvas = new fabric.Canvas(window['canvas' + dynamicVarName]);
                    ProductDesigner.prototype.canvas.selection = false;
                    ProductDesigner.prototype.containerCanvases['@' + prod.image_id + '&' + prod.dim[i].design_area_id] = ProductDesigner.prototype.canvas;
                    this.canvas.side = prod.image_side;
                    ProductDesigner.prototype.currentImageSide = prod.image_side;
                    this.observeCanvas();
                    ProductDesigner.prototype.ImageMultipleArray['@' + prod.image_id] = true;
                } else {
                    var designArea = ProductDesigner.prototype.product_container_layers['@' + prod.image_id + '&' + prod.dim[i].design_area_id];
                    ProductDesigner.prototype.product_container.appendChild(designArea);
                    ProductDesigner.prototype.designArea = designArea;
                    ProductDesigner.prototype.canvas = this.containerCanvases['@' + prod.image_id + '&' + prod.dim[i].design_area_id];
                    ProductDesigner.prototype.canvas.selection = false;
                    //active canvas for the brush
                    for (var index in ProductDesigner.prototype.containerCanvases) {
                        var canvas = ProductDesigner.prototype.containerCanvases[index];
                        canvas.isDrawingMode = false;
                    }
                }
                ProductDesigner.prototype.currentProduct = '@' + prod.image_id;
                ProductDesigner.prototype.currentDesignArea = '@' + prod.image_id + '&' + prod.dim[prod.dim.length - 1].design_area_id;
                ProductDesigner.prototype.currentDesignAreaId = prod.dim[prod.dim.length - 1].design_area_id;
            }
            var designLength = prod.dim.length - 1;
            window['designArea' + designLength].style.borderColor = "red";
        }
        ProductDesigner.prototype.canvas.controlsAboveOverlay = true;
        ProductDesigner.prototype.imageSize = {
            height: ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].height,
            width: ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].width
        };
    },
    observeSelectDesignArea: function() {
        // Event.on($('diff_canvas'), 'click', '.diff_canvas', function(e, elm){
        jQuery('#product_designer_main_content').on('click', '.design-container', function(e, elm) {
            this.resetCanvasBorder();
            var selectionArea = e.currentTarget.getAttribute('selection_area');
            var designAreaId = e.currentTarget.getAttribute('designAreaId');
            ProductDesigner.prototype.canvas = ProductDesigner.prototype.containerCanvases[selectionArea];
            var isNameNumber = false;
            for (designAreaId1 in ProductDesigner.prototype.containerCanvases) {
                if (designAreaId1 != selectionArea) {
                    var objects = ProductDesigner.prototype.containerCanvases[designAreaId1].getObjects();
                    for (var i = 0; i < objects.length; i++) {
                        if (objects[i].type == 'text' && objects[i].group_type != undefined) {
                            isNameNumber = true;
                            break;
                        }
                    }
                }
            }
            if (jQuery('#group-order-content')) {
                if (isNameNumber) {
                    jQuery('#group-order-content').addClass('disabled');
                } else {
                    jQuery('#group-order-content').removeClass('disabled');
                }
            }
            var currCanvas1 = ProductDesigner.prototype.canvas;
            var allObj = currCanvas1.getObjects();
            if (allObj.length == 0) {
                if (jQuery('#add_text_area')) {
                    jQuery('#text_prop_container').addClass('disabled');
                    jQuery('#text_prop_container').attr('disabled', 'disabled');
                }
                if (jQuery('#add_text_area_2')) {
                    jQuery('#text_prop_container').addClass('disabled');
                    jQuery('#text_prop_container').attr('disabled', 'disabled');
                }
            } else {
                for (var i = 0; i < allObj.length; i++) {
                    if (allObj[i].type != 'text' && allObj[i].type != 'group' && allObj[i].type != 'image' && allObj[i].type != 'path' && allObj[i].type != 'path-group') {}
                }
            }
            ProductDesigner.prototype.currentDesignArea = selectionArea;
            ProductDesigner.prototype.currentDesignAreaId = designAreaId;
            for (var index in ProductDesigner.prototype.containerCanvases) {
                var canvas = ProductDesigner.prototype.containerCanvases[index];
                canvas.isDrawingMode = false;
            }
            this.removeAllSelectedObject(this.canvas);
            // ProductDesigner.observeCanvasOther();
            // $('designArea-'+elm.readAttribute('id')).style.border = '2px dashed';
            // $('designArea-'+elm.readAttribute('id')).style.borderColor = "red";
            var designAreaNew = e.currentTarget;
            // designAreaNew.style.border = '2px dashed';
            jQuery(designAreaNew).css('border-color', 'red');
            //this.addBrush(this.canvas);
        }.bind(this));
    },
    removeAllSelectedObject: function(canvas_current) {
        for (var index in ProductDesigner.prototype.containerCanvases) {
            var canvas = ProductDesigner.prototype.containerCanvases[index];
            if (canvas != canvas_current) {
                canvas.deactivateAll().renderAll();
            }
        }
    },
    resetCanvasBorder: function() {
        jQuery('.design-container').each(function(index, val) {
            jQuery(val).css('border', '1px dashed');
            jQuery(val).css('border-color', 'black');
        });
    },
    initPrices: function() {
        ProductDesigner.prototype.pricesContainers[0] = jQuery('#fixed_price');
        // this.pricesContainers[1] = $('design_areas_price');
        ProductDesigner.prototype.pricesContainers[1] = jQuery('#image_price');
        ProductDesigner.prototype.pricesContainers[2] = jQuery('#text_price');
        ProductDesigner.prototype.pricesContainers[3] = jQuery('#custom_image_price');
    },
    reloadPrice: function() {
        var imagesPrice = 0.0;
        var textsPrice = 0.0;
        var customImagesPrice = 0.0;
        //var designAreasPrice = 0.0;
        var subTotal = 0.0;
        this.designerPrices = {};
        if (this.data.prices.fixed_price > 0) {
            var fixedPrice = parseFloat(this.data.prices.fixed_price);
            var fixedPriceConfig = {
                price: fixedPrice,
                type: "fixed"
            };
            subTotal += fixedPrice;
            if (OptionsPrice != undefined) {
                OptionsPrice.addCustomPrices('fixed_price', fixedPriceConfig);
            }
            this.designerPrices['fixed_price'] = fixedPrice;
        }
        for (var id in ProductDesigner.prototype.containerCanvases) {
            var canvas = ProductDesigner.prototype.containerCanvases[id];
            var designAreaPrice = 0;
            if (canvas && canvas != 'undefined') {
                var canvasCount = canvas.getObjects().length;
                if (canvasCount > 0) {
                    id1 = id.split("&")[0];
                    if (this.data.product.images[this.currentProductColor].hasOwnProperty(id.split("&")[0])) {
                        var designArea = this.data.product.images[this.currentProductColor][id.split("&")[0]];
                        var imagesCount = 0;
                        var textsCount = 0;
                        var customImagesCount = 0;
                        var imagePrice = parseFloat(this.prices.image_price);
                        var textPrice = parseFloat(this.prices.text_price);
                        var customImagePrice = parseFloat(this.prices.custom_image_price);
                        var object = canvas.getObjects();
                        for (var i = 0; i < object.length; i++) {
                            if (object[i].type == 'text' || object[i].type == 'group') {
                                textsCount++;
                                if (textPrice > 0) {
                                    textsPrice += textPrice;
                                    subTotal += textPrice;
                                }
                            } else if (object[i].type == 'image' || (object[i].type == 'path') || (object[i].type == 'path-group')) {
                                if (object[i].tab == 'design') {
                                    imagesCount++;
                                    if (imagePrice > 0) {
                                        if (object.price > 0) {
                                            imagesPrice += parseFloat(object.price);
                                            subTotal += parseFloat(object.price);
                                        } else {
                                            imagesPrice += imagePrice;
                                            subTotal += imagePrice;
                                        }
                                    }
                                } else if (object[i].tab == 'upload') {
                                    customImagesCount++;
                                    if (customImagePrice > 0) {
                                        customImagesPrice += customImagePrice;
                                        subTotal += customImagePrice;
                                    }
                                }
                            }
                        }
                        if (this.designerPrices['image'] == undefined) {
                            this.designerPrices['image'] = {};
                        }
                        var newObjectImageId = id.replace("@", "");
                        this.designerPrices['image'][newObjectImageId] = designAreaPrice + (imagePrice * imagesCount) + (textPrice * textsCount) + (customImagePrice * customImagesCount);
                        var text_count = this.designerPrices['text_count'];
                        var image_count = this.designerPrices['image_count'];
                        var custom_image_count = this.designerPrices['custom_image_count'];
                        if (this.designerPrices['text_count'] == undefined) {
                            this.designerPrices['text_count'] = textsCount;
                        } else {
                            this.designerPrices['text_count'] += textsCount;
                        }
                        if (this.designerPrices['image_count'] == undefined) {
                            this.designerPrices['image_count'] = imagesCount;
                        } else {
                            this.designerPrices['image_count'] += imagesCount;
                        }
                        if (this.designerPrices['custom_image_count'] == undefined) {
                            this.designerPrices['custom_image_count'] = customImagesCount;
                        } else {
                            this.designerPrices['custom_image_count'] += customImagesCount;
                        }
                    }
                }
            }
        }
        this.designerPrices['sub_total'] = subTotal;
        //this.designerPrices['design_areas_price'] = designAreasPrice;
        this.designerPrices['text_price'] = textsPrice;
        this.designerPrices['image_price'] = imagesPrice;
        this.designerPrices['custom_image_price'] = customImagesPrice;
        if (OptionsPrice != undefined) {
            //OptionsPrice.addCustomPrices('design_area_price', {price: designAreasPrice, type: 'fixed'});
            OptionsPrice.addCustomPrices('design_text_price', {
                price: textsPrice,
                type: 'fixed'
            });
            OptionsPrice.addCustomPrices('design_image_price', {
                price: imagesPrice,
                type: 'fixed'
            });
            OptionsPrice.addCustomPrices('design_custom_image_price', {
                price: customImagesPrice,
                type: 'fixed'
            });
            OptionsPrice.setDuplicateIdSuffix('-design');
            OptionsPrice.reload();
        }
        this.updatePriceInfo(this.designerPrices);
    },
    updatePriceInfo: function(prices) {
        jQuery.each(this.pricesContainers, function(key, value) {
            if (prices.hasOwnProperty(jQuery(value).attr('id'))) {
                var id1 = jQuery(value).attr('id');
                var price = prices[id1];
                var a = jQuery('#' + jQuery(jQuery(value)[0]).attr('id')).find('.price')[0];
                if (price > 0 && a) {
                    var formattedPrice = price;
                    //var formattedPrice = priceOptions.formatPrice(price);
                    jQuery(value['selector']).find('.price').html(formattedPrice);
                    jQuery(value['selector']).find('.price').show();
                } else if (price == 0) {
                    jQuery(value['selector']).find('.price').hide();
                }
            }
        });
    },
    observColorCountObj: function() {
        jQuery('#used_color_container_obj').html('');
        this.productDesigner = ProductDesigner.prototype;
        var canvas = this.productDesigner.canvas;
        var obj = canvas.getActiveObject();
        if (obj || obj != null) {
            if (((obj.type == 'image') || (obj.type == 'path-group') || (obj.type == 'path')) && (obj.tab != 'upload')) {
                if (obj.type == 'image') {
                    jQuery('#obj_color').hide();
                } else if (obj.type == 'path-group' || obj.type == 'path') {
                    jQuery('#obj_color').show();
                    var obj_used_colors = Array();
                    for (var i = 0; i < obj.paths.length; i++) {
                        var fill_color = obj.paths[i].fill;
                        //var stroke_color = obj.paths[i].stroke;
                        if ((fill_color != '') && (fill_color != null) && (fill_color instanceof Object == false)) {
                            var fill_color_hex = new RGBColor(fill_color);
                            /*for (var j = 0; j < obj_used_colors.length; j++) {
                             if(fill_color_hex.toHex() != obj_used_colors[j]){
                             obj_used_colors.push(fill_color_hex.toHex());
                             }
                             }*/
                            obj_used_colors.push(fill_color_hex.toHex());
                        }
                        /*if((stroke_color != '') && (stroke_color != null) && (stroke_color instanceof Object == false)){
                         var stroke_color_hex = new RGBColor(stroke_color);                  obj_used_colors.push(stroke_color_hex.toHex());
                         }*/
                        var object = obj;
                    }
                    var obj_used_colors_obj = distinctVal(obj_used_colors);
                    if (object && object != null) {
                        object.set({
                            obj_used_colors_obj: obj_used_colors
                        });
                    }
                    jQuery('#used_color_container_obj').html('');
                    for (var j = 0; j < obj_used_colors_obj.length; j++) {
                        var spanEle = document.createElement("span");
                        spanEle.className = 'used-color';
                        spanEle.setAttribute("style", "background-color:" + obj_used_colors_obj[j]);
                        spanEle.setAttribute("colorId", obj_used_colors_obj[j]);
                        var text = document.createTextNode(obj_used_colors_obj[j]);
                        spanEle.appendChild(text);
                        jQuery('#used_color_container_obj').append(spanEle);
                    }
                } else if (obj.type == 'path') {
                    var obj_used_colors = Array();
                    var fill_color = obj.fill;
                    //var stroke_color = obj.stroke;
                    if ((fill_color != '') && (fill_color != null) && (fill_color instanceof Object == false)) {
                        var fill_color_hex = new RGBColor(fill_color);
                        obj_used_colors.push(fill_color_hex.toHex());
                    }
                    /*if((stroke_color != '') && (stroke_color != null) && (stroke_color instanceof Object == false)){
                     var stroke_color_hex = new RGBColor(stroke_color);
                     obj_used_colors.push(stroke_color_hex.toHex());
                     }*/
                    var object = obj;
                    obj_used_colors_obj = jQuery.unique(obj_used_colors);
                    if (object && object != null) {
                        object.set({
                            obj_used_colors_obj: obj_used_colors
                        });
                    }
                    jQuery('#used_color_container_obj').html('');
                    for (var j = 0; j < obj_used_colors_obj.length; j++) {
                        var spanEle = document.createElement("span");
                        spanEle.className = 'used-color';
                        spanEle.setAttribute("style", "background-color:" + obj_used_colors_obj[j]);
                        spanEle.setAttribute("colorId", obj_used_colors_obj[j]);
                        var text = document.createTextNode(obj_used_colors_obj[j]);
                        spanEle.appendChild(text);
                        jQuery('#used_color_container_obj').append(spanEle);
                    }
                } else {}
                // this.reloadPrice();
            } else if (obj.type == 'text') {
                var obj_used_colors = Array();
                var fill_color_hex = new RGBColor(obj.fill);
                obj_used_colors.push(fill_color_hex.toHex());
                if (obj.textBackgroundColor && obj.textBackgroundColor != '') {
                    var textBackground_color_hex = new RGBColor(obj.textBackgroundColor);
                    obj_used_colors.push(textBackground_color_hex.toHex());
                }
                if (obj.shadow) {
                    var shadow_color_hex = new RGBColor(obj.shadow.color);
                    obj_used_colors.push(shadow_color_hex.toHex());
                }
                if (obj.stroke) {
                    var stroke_color_hex = new RGBColor(obj.stroke);
                    obj_used_colors.push(stroke_color_hex.toHex());
                }
                var object = obj;
                if (object && object != null) {
                    object.set({
                        used_colors: obj_used_colors
                    });
                }
                this.reloadPrice();
            }
            if (obj.tab == 'upload') {
                if (obj.used_colors != undefined) {
                    obj_used_colors_obj = jQuery.unique(obj_used_colors);
                    jQuery('#used_color_container_obj').html('');
                    for (var j = 0; j < obj_used_colors_obj.length; j++) {
                        var spanEle = document.createElement("span");
                        spanEle.className = 'used-color';
                        spanEle.setAttribute("style", "background-color:" + obj_used_colors_obj[j]);
                        spanEle.setAttribute("colorId", obj_used_colors_obj[j]);
                        var text = document.createTextNode(obj_used_colors_obj[j]);
                        spanEle.appendChild(text);
                        jQuery('#used_color_container_obj').append(spanEle);
                    }
                    this.reloadPrice();
                }
            }
        }
    },
    observColorCount: function() {
        ProductDesigner.prototype.used_colors = Array();
        for (var key in LayersManager.prototype.layers) {
            var obj_used_colors = Array();
            var obj = LayersManager.prototype.layers[key];
            if (obj || obj != null) {
                if (((obj.type == 'image') || (obj.type == 'path-group') || (obj.type == 'path')) && (obj.tab != 'upload')) {
                    if (obj.type == 'image') {
                        ProductDesigner.prototype.used_colors.push('#000000');
                        obj_used_colors.push('#000000');
                        var object = obj;
                        if (object && object != null) {
                            object.set({
                                used_colors: obj_used_colors
                            });
                        }
                        ProductDesigner.prototype.used_colors = jQuery.unique(ProductDesigner.prototype.used_colors);
                        /*if (!ProductDesigner.prototype.isAdmin)
                         {
                         $('used_color_container').innerHTML = '';
                         var used_color_label = "<label class='used-color-label'>" + Translator.translate("Used Colors22222") + "</label>";
                         $('used_color_container').innerHTML = used_color_label;
                         for (var j = 0; j < this.used_colors.length; j++) {
                         var spanEle = document.createElement("span");
                         spanEle.className = 'used-color';
                         spanEle.setAttribute("style", "background-color:" + this.used_colors[j]);
                         var text = document.createTextNode(this.used_colors[j]);
                         spanEle.appendChild(text);
                         
                         $('used_color_container').appendChild(spanEle);
                         
                         }
                         }*/
                    } else if (obj.type == 'path-group') {
                        for (var i = 0; i < obj.paths.length; i++) {
                            var fill_color = obj.paths[i].fill;
                            if ((fill_color != '') && (fill_color != null) && (fill_color instanceof Object == false)) {
                                var fill_color_hex = new RGBColor(fill_color);
                                this.used_colors.push(fill_color_hex.toHex());
                                obj_used_colors.push(fill_color_hex.toHex());
                            }
                            var object = obj;
                            if (object && object != null) {
                                object.set({
                                    used_colors: obj_used_colors
                                });
                            }
                            ProductDesigner.prototype.used_colors = jQuery.unique(this.used_colors);
                            /*if (!ProductDesigner.isAdmin)
                             {
                             $('used_color_container').innerHTML = '';
                             var used_color_label = "<label class='used-color-label'>" + Translator.translate("Used Colors1111") + "</label>";
                             $('used_color_container').innerHTML = used_color_label;
                             for (var j = 0; j < this.used_colors.length; j++) {
                             var spanEle = document.createElement("span");
                             spanEle.className = 'used-color';
                             spanEle.setAttribute("style", "background-color:" + this.used_colors[j]);
                             var text = document.createTextNode(this.used_colors[j]);
                             spanEle.appendChild(text);
                             
                             $('used_color_container').appendChild(spanEle);
                             
                             }
                             }*/
                        }
                    } else if (obj.type == 'path') {
                        var fill_color = obj.fill;
                        if ((fill_color != '') && (fill_color != null) && (fill_color instanceof Object == false)) {
                            var fill_color_hex = new RGBColor(fill_color);
                            ProductDesigner.prototype.used_colors.push(fill_color_hex.toHex());
                            obj_used_colors.push(fill_color_hex.toHex());
                        }
                        var object = obj;
                        if (object && object != null) {
                            object.set({
                                used_colors: obj_used_colors
                            });
                        }
                        ProductDesigner.prototype.used_colors = jQuery.unique(ProductDesigner.prototype.used_colors);
                        /*if (!ProductDesigner.isAdmin)
                         {
                         $('used_color_container').innerHTML = '';
                         var used_color_label = "<label class='used-color-label'>" + Translator.translate("Used Colors") + "</label>";
                         $('used_color_container').innerHTML = used_color_label;
                         for (var j = 0; j < this.used_colors.length; j++) {
                         var spanEle = document.createElement("span");
                         spanEle.className = 'used-color';
                         spanEle.setAttribute("style", "background-color:" + this.used_colors[j]);
                         var text = document.createTextNode(this.used_colors[j]);
                         spanEle.appendChild(text);
                         
                         $('used_color_container').appendChild(spanEle);
                         
                         }
                         
                         }*/
                    } else {}
                    ProductDesigner.prototype.reloadPrice();
                    ProductDesigner.prototype.reloadPrintingPrice();
                } else if (obj.type == 'text') {
                    var obj_fill = new RGBColor(obj.fill);
                    ProductDesigner.prototype.used_colors.push(obj_fill.toHex());
                    obj_used_colors.push(obj_fill.toHex());
                    if (obj.textBackgroundColor && obj.textBackgroundColor != '') {
                        var obj_textBackgroundColor = new RGBColor(obj.textBackgroundColor);
                        ProductDesigner.prototype.used_colors.push(obj_textBackgroundColor.toHex());
                        obj_used_colors.push(obj_textBackgroundColor.toHex());
                    }
                    if (obj.shadow) {
                        var obj_shadowcolor = new RGBColor(obj.shadow.color);
                        ProductDesigner.prototype.used_colors.push(obj_shadowcolor.toHex());
                        obj_used_colors.push(obj_shadowcolor.toHex());
                    }
                    if (obj.stroke) {
                        var obj_stroke = new RGBColor(obj.stroke);
                        ProductDesigner.prototype.used_colors.push(obj_stroke.toHex());
                        obj_used_colors.push(obj_stroke.toHex());
                    }
                    var object = obj;
                    if (object && object != null) {
                        object.set({
                            used_colors: obj_used_colors
                        });
                    }
                    ProductDesigner.prototype.reloadPrice();
                    ProductDesigner.prototype.reloadPrintingPrice();
                }
                if (obj.tab == 'upload') {
                    if (obj.type == 'path-group') {
                        for (var i = 0; i < obj.paths.length; i++) {
                            var fill_color = obj.paths[i].fill;
                            if ((fill_color != '') && (fill_color != null) && (fill_color instanceof Object == false)) {
                                var fill_color_hex = new RGBColor(fill_color);
                                this.used_colors.push(fill_color_hex.toHex());
                                obj_used_colors.push(fill_color_hex.toHex());
                            }
                            var object = obj;
                            if (object && object != null) {
                                object.set({
                                    used_colors: obj_used_colors
                                });
                            }
                            productDesigner.prototype.used_colors = jQuery.unique(productDesigner.prototype.used_colors);
                            /*if (!ProductDesigner.isAdmin)
                             {
                             $('used_color_container').innerHTML = '';
                             var used_color_label = "<label class='used-color-label'>" + Translator.translate("Used Colors") + "</label>";
                             $('used_color_container').innerHTML = used_color_label;
                             for (var j = 0; j < this.used_colors.length; j++) {
                             var spanEle = document.createElement("span");
                             spanEle.className = 'used-color';
                             spanEle.setAttribute("style", "background-color:" + this.used_colors[j]);
                             var text = document.createTextNode(this.used_colors[j]);
                             spanEle.appendChild(text);
                             
                             $('used_color_container').appendChild(spanEle);
                             
                             }
                             }*/
                        }
                    } else if (obj.type == 'path') {
                        var fill_color = obj.fill;
                        if ((fill_color != '') && (fill_color != null) && (fill_color instanceof Object == false)) {
                            var fill_color_hex = new RGBColor(fill_color);
                            ProductDesigner.prototype.used_colors.push(fill_color_hex.toHex());
                            obj_used_colors.push(fill_color_hex.toHex());
                        }
                        var object = obj;
                        if (object && object != null) {
                            object.set({
                                used_colors: obj_used_colors
                            });
                        }
                        ProductDesigner.prototype.used_colors = jQuery.unique(ProductDesigner.prototype.used_colors);
                        /*if (!ProductDesigner.isAdmin)
                         {
                         $('used_color_container').innerHTML = '';
                         var used_color_label = "<label class='used-color-label'>" + Translator.translate("Used Colors") + "</label>";
                         $('used_color_container').innerHTML = used_color_label;
                         for (var j = 0; j < this.used_colors.length; j++) {
                         var spanEle = document.createElement("span");
                         spanEle.className = 'used-color';
                         spanEle.setAttribute("style", "background-color:" + this.used_colors[j]);
                         var text = document.createTextNode(this.used_colors[j]);
                         spanEle.appendChild(text);
                         
                         $('used_color_container').appendChild(spanEle);
                         
                         }
                         }*/
                    } else if (obj.used_colors != undefined) {
                        for (var j = 0; j < obj.used_colors.length; j++) {
                            ProductDesigner.prototype.used_colors.push(obj.used_colors[j]);
                        }
                        ProductDesigner.prototype.used_colors = jQuery.unique(ProductDesigner.prototype.used_colors);
                        /*if (!ProductDesigner.isAdmin)
                         {
                         $('used_color_container').innerHTML = '';
                         var used_color_label = "<label class='used-color-label'>" + Translator.translate("Used Colors") + "</label>";
                         $('used_color_container').innerHTML = used_color_label;
                         for (var j = 0; j < this.used_colors.length; j++) {
                         var spanEle = document.createElement("span");
                         spanEle.className = 'used-color';
                         spanEle.setAttribute("style", "background-color:" + this.used_colors[j]);
                         var text = document.createTextNode(this.used_colors[j]);
                         spanEle.appendChild(text);
                         
                         $('used_color_container').appendChild(spanEle);
                         
                         }
                         }*/
                    }
                    ProductDesigner.prototype.reloadPrice();
                    ProductDesigner.prototype.reloadPrintingPrice();
                }
            }
        }
        ProductDesigner.prototype.used_colors = jQuery.unique(ProductDesigner.prototype.used_colors);
        /*if (!ProductDesigner.prototype.isAdmin)
         {
         $('used_color_container').innerHTML = '';
         var used_color_label = "<label class='used-color-label'>" + Translator.translate("Used Colors") + "</label>";
         $('used_color_container').innerHTML = used_color_label;
         for (var j = 0; j < ProductDesigner.prototype.used_colors.length; j++) {
         var spanEle = document.createElement("span");
         spanEle.className = 'used-color';
         spanEle.setAttribute("style", "background-color:" + this.used_colors[j]);
         var text = document.createTextNode(this.used_colors[j]);
         spanEle.appendChild(text);
         
         $('used_color_container').appendChild(spanEle);
         
         }
         }*/
    },
    observeControls: function() {
        this.productDesigner = ProductDesigner.prototype;
        /**
         * Object horizantal flip function
         */
        jQuery('#obj_flip_horizantal').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.canvas.getActiveObject();
            if (!obj) {
                return;
            }
            var flip = false;
            var originalFlipX = obj.flipX;
            var originalFlipY = obj.flipY;
            if (obj.flipX == false) {
                flip = true;
            } else {
                flip = false;
            }
            var cmd = new UpdateCommand(canvas, obj, {
                flipX: flip
            });
            cmd.exec();
            History.prototype.push(cmd);
        }.bind(this));
        /**
         * Object vertically flip function
         */
        jQuery('#obj_flip_vertical').on('click', function(e) {
            var canvas = this.canvas;
            var obj = this.canvas.getActiveObject();
            if (!obj) {
                return;
            }
            var flip = false;
            var originalFlipX = obj.flipX;
            var originalFlipY = obj.flipY;
            if (obj.flipY == false) {
                flip = true;
            } else {
                flip = false;
            }
            var cmd = new UpdateCommand(canvas, obj, {
                flipY: flip
            });
            cmd.exec();
            History.prototype.push(cmd);
        }.bind(this));
        /**
         * Object Align center function
         */
        jQuery('#obj_align_center').on('click', function(e) {
            var canvas = this.canvas;
            var obj = this.canvas.getActiveObject();
            if (!obj) {
                return;
            }
            var cmd = new AlignToCenter(canvas, obj);
            cmd.exec();
            History.prototype.push(cmd);
            // obj.selectable = true;
            // this.canvas.setActiveObject(obj);
        }.bind(this));
        /**
         * Object events undo function
         */
        jQuery('#undo').on('click', function(e) {
            //e.stop();
            History.prototype.undo();
        }.bind(this));
        /**
         * Object events redo function
         */
        jQuery('#redo').on('click', function(e) {
            //e.stop();
            History.prototype.redo();
        }.bind(this));
        /**
         * Object events front object to front function
         */
        jQuery('#obj_bring_front').on('click', function(e) {
            var canvas = this.canvas;
            var obj = this.canvas.getActiveObject();
            if (!obj) {
                return;
            }
            //this.canvas.bringForward(obj);
            var cmd = new BringFrontCommand(canvas, obj);
            cmd.exec();
            History.prototype.push(cmd);
        }.bind(this));
        /**
         * Object events front object to back function
         */
        jQuery('#obj_bring_back').on('click', function(e) {
            var canvas = this.canvas;
            var obj = this.canvas.getActiveObject();
            if (!obj) {
                return;
            }
            //this.canvas.sendBackwards(obj);
            var cmd = new SendBackCommand(canvas, obj);
            cmd.exec();
            History.prototype.push(cmd);
        }.bind(this));
        jQuery('#obj_delete').on('click', function(e) {
            var canvas = this.canvas;
            canvas.isDrawingMode = false;
            this.productDesigner = ProductDesigner.prototype;
            //e.stop();
            var obj = this.canvas.getActiveObject();
            if (obj) {
                var cmd = new RemoveCanvasObject(this.productDesigner, obj);
                cmd.exec();
                History.prototype.push(cmd);
            }
        }.bind(this));
        jQuery('#clearall').on('click', function(e) {
            for (var imageId in this.containerCanvases) {
                var currentsideremove = imageId.split("&");
                var canvas = this.containerCanvases[imageId];
                var length = canvas.getObjects().length;
                if (this.currentProduct) {
                    if (canvas.getActiveGroup() != undefined) {
                        canvas.discardActiveGroup();
                        canvas.renderAll();
                    }
                    //alert(length);
                    for (var i = 0; i < length; i++) {
                        this.productDesigner = ProductDesigner.prototype;
                        var cmd = new RemoveCanvasObject(this.productDesigner, canvas.getObjects()[0]);
                        cmd.exec();
                        History.prototype.push(cmd);
                    }
                }
            }
            if (length > 0 || length != null || length != undefined) {
                jQuery('#clearall').addClass('disabled');
            } else {
                jQuery('#clearall').removeClass('disabled');
            }
        }.bind(this));
        jQuery('#obj_duplicate').on('click', function(e) {
            var canvas = this.canvas;
            canvas.isDrawingMode = false;
            this.productDesigner = ProductDesigner.prototype;
            //e.stop();
            var obj = this.canvas.getActiveObject();
            if (obj) {
                var object = fabric.util.object.clone(obj);
                object.set("top", obj.top + 5);
                object.set("left", obj.left + 5);
                object.set('obj_id', 'id_' + Date.now());
                var cmd = new InsertCanvasObject(this, object, true);
                cmd.exec();
                History.prototype.push(cmd);
            }
        }.bind(this));
    },
    observSelectTab: function() {
        if (jQuery('#templates_tab')) {
            jQuery('#templates_tab').on('click', function(e) {
                if (jQuery('#template_categories') == null) var templaval = 0;
                else var templaval = jQuery('#template_categories').val();
                if (jQuery(template_list).children().length == 0) {
                    var data = {};
                    data['template_category_id'] = templaval;
                    DesignTemplates.filterImagesByTemplate(data);
                }
                jQuery("#layers_manager").hide();
                this.canvas.deactivateAll().renderAll();
                jQuery('text_prop_container').addClass('disabled');
                jQuery('.inner-tab-option').each(function(index, val) {
                    jQuery(val).css("display", "none");
                });
                jQuery('.desgin-detail').each(function(index, val) {
                    jQuery(val).css("display", "none");
                    jQuery(val).removeClass('resp-tab-content-active');
                });
                jQuery('#add_template_content').addClass('resp-tab-content-active');
                jQuery('#add_template_content').css("display", "block");
            }.bind(this));
        }
        if (jQuery('#mydesigns_tab')) {
            jQuery('#mydesigns_tab').on('click', function(e) {
                jQuery("#layers_manager").hide();
                this.canvas.deactivateAll().renderAll();
                jQuery('text_prop_container').addClass('disabled');
                jQuery('.inner-tab-option').each(function(index, val) {
                    jQuery(val).css("display", "none");
                });
                jQuery('.desgin-detail').each(function(index, val) {
                    jQuery(val).css("display", "none");
                    jQuery(val).removeClass('resp-tab-content-active');
                });
                jQuery('#add_mydesigns_content').addClass('resp-tab-content-active');
                jQuery('#add_mydesigns_content').css("display", "block");
            }.bind(this));
        }
        if (jQuery('#grouporder_tab')) {
            jQuery('#grouporder_tab').on('click', function(e) {
                jQuery("#layers_manager").hide();
                this.canvas.deactivateAll().renderAll();
                if (jQuery('isname').checked == false && jQuery('isnumber').checked == false) {
                    jQuery('name-number-content').addClass('disabled');
                    jQuery('group_font_properties').addClass('disabled');
                }
                jQuery('#text_prop_container').addClass('disabled');
                jQuery('.inner-tab-option').each(function(index, val) {
                    jQuery(val).css("display", "none");
                });
                jQuery('.desgin-detail').each(function(index, val) {
                    jQuery(val).css("display", "none");
                    jQuery(val).removeClass('resp-tab-content-active');
                });
                jQuery('#add_name_num_content').addClass('resp-tab-content-active');
                jQuery('#add_name_num_content').css("display", "block");
                jQuery('#grouporder_tab').addClass('resp-tab-active');
                //jQuery('#grouporder_tab').css("backgroundColor", "white");
            }.bind(this));
        }
        jQuery('#text_tab').on('click', function(e) {
            jQuery("#layers_manager").hide();
            this.canvas.deactivateAll().renderAll();
            jQuery('#text_prop_container').addClass('disabled');
            jQuery('.nav_tab').each(function(index, val) {
                jQuery(val).removeClass('resp-tab-active');
                jQuery(val).css("background-color", "");
            });
            jQuery('.tab-detail').each(function(index, val) {
                jQuery(val).removeClass('selected');
            });
            jQuery('.desgin-detail').each(function(index, val) {
                jQuery(val).css("display", "none");
                jQuery(val).removeClass('resp-tab-content-active');
            });
            jQuery('.inner-tab-option').each(function(index, val) {
                jQuery(val).css("display", "none");
            });
            if (jQuery("#add_text_btn")[0] != undefined) {
                jQuery('#inner-tab-option-text').addClass('resp-tab-content-active');
                if (jQuery('#choose_quotes_btn')[0] != undefined) jQuery('#choose_quotes_btn').parent().removeClass('selected');
                jQuery('#add_text_btn').parent().addClass('selected');
                jQuery('#add_text').css("display", "block");
                jQuery('#text_tab').addClass('resp-tab-active');
                //jQuery('#text_tab').css("background-color", "white");
                jQuery('#inner-tab-option-text').css("display", "block");
            } else {
                jQuery('#inner-tab-option-text').addClass('resp-tab-content-active');
                if (jQuery('#choose_quotes_btn')[0] != undefined) jQuery('#choose_quotes_btn').parent().addClass('selected');
                jQuery('#choose_quotes').css("display", "block");
                jQuery('#text_tab').addClass('resp-tab-active');
                //jQuery('#text_tab').css("background-color", "white");
                jQuery('#inner-tab-option-text').css("display", "block");
            }
        }.bind(this));
        if (jQuery('#product_tab')) {
            jQuery('#product_tab').on('click', function(e) {
                //alert("Hi");
                if (jQuery('#product_list').children().length == 0) {
                    if (jQuery('#product_categories')) {
                        var data = {};
                        data = jQuery('#product_categories').val();
                        Categorydesigner.prototype.filterProductsByCategory(data);
                    }
                }
                jQuery("#layers_manager").hide();
                this.canvas.deactivateAll().renderAll();
                jQuery('#text_prop_container').addClass('disabled');
                jQuery('.inner-tab-option').each(function(index, val) {
                    jQuery(val).css("display", "none");
                });
                jQuery('.desgin-detail').each(function(index, val) {
                    jQuery(val).css("display", "none");
                    jQuery(val).removeClass('resp-tab-content-active');
                });
                jQuery('#add_products_content').addClass('resp-tab-content-active');
                jQuery('#add_products_content').css("display", "block");
            }.bind(this));
        }
        jQuery('#clipart_tab').on('click', function(e) {
            if (jQuery('#image_list')) {
                if (jQuery('#image_list').children().length == 0) {
                    if (jQuery('#clipart_categories')) {
                        var data = {};
                        data['clipart_category_id'] = jQuery('#clipart_categories').val();
                        if (jQuery('#search_tag_field')) {
                            data['search_tag_field'] = jQuery('#search_tag_field').val();
                        }
                        Clipartdesigner.prototype.filterImagesByClipart(data);
                    }
                }
            }
            if (!jQuery('#add_shapes').length == 0) {
                if (jQuery('#image_list_shapes')) {
                    if ((jQuery('#image_list_shapes').children().length == 0)) {
                        if (jQuery('#shapes_categories')) {
                            var data = {};
                            data['shapes_category_id'] = jQuery('#shapes_categories').val();
                            if (jQuery('#search_tag_field_shape')) {
                                data['search_tag_field_shape'] = jQuery('#search_tag_field_shape').val();
                            }
                            Shapesdesigner.prototype.filterImagesByShapes(data);
                        }
                    }
                }
            }
            jQuery("#layers_manager").hide();
            this.canvas.deactivateAll().renderAll();
            jQuery('#text_prop_container').addClass('disabled');
            jQuery('.nav_tab').each(function(index, val) {
                jQuery(val).removeClass('resp-tab-active');
                jQuery(val).css("background-color", "");
            });
            jQuery('.tab-detail').each(function(index, val) {
                jQuery(val).removeClass('selected');
            });
            jQuery('.desgin-detail').each(function(index, val) {
                jQuery(val).css("display", "none");
                jQuery(val).removeClass('resp-tab-content-active');
            });
            jQuery('.inner-tab-option').each(function(index, val) {
                jQuery(val).css("display", "none");
            });
            if (jQuery('#add_upload_image_btn')[0] != undefined) {
                jQuery('#inner-tab-option-clipart').addClass('resp-tab-content-active');
                jQuery('#shape_arts_btn').parent().removeClass('selected');
                jQuery('#img_customize_btn').parent().removeClass('selected');
                jQuery('#add_upload_image_btn').parent().addClass('selected');
                jQuery('#add_upload_image').css("display", "block");
                jQuery('#clipart_tab').addClass('resp-tab-active');
                jQuery('#inner-tab-option-clipart').css("display", "block");
            } else {
                jQuery('#inner-tab-option-clipart').addClass('resp-tab-content-active');
                jQuery('#img_customize_btn').parent().removeClass('selected');
                jQuery('#shape_arts_btn').parent().addClass('selected');
                jQuery('#shape_arts').css("display", "block");
                jQuery('#clipart_tab').addClass('resp-tab-active');
                jQuery('#inner-tab-option-clipart').css("display", "block");
            }
        }.bind(this));
    },
    toggleImageSelectedClass: function(obj, method) {
        if (obj && obj.type == 'image') {
            if (method == 'add') {
                jQuery('.clipart-image').each(function(index, val) {
                    if (!jQuery(val).hasClass('selected')) {
                        if (jQuery(val).attr('data-orig-url') == obj._element.src) {
                            jQuery(val).addClass('selected');
                        }
                    }
                });
            } else if (method == 'remove') {
                jQuery('.clipart-image').each(function(index, val) {
                    if (jQuery(val).hasClass('selected')) {
                        if (jQuery(val).attr('data-orig-url') == obj._element.src) {
                            jQuery(val).removeClass('selected');
                        }
                    }
                });
            }
        }
    },
    observeContinueButton: function() {
        jQuery('#continue_btn').on('click', function(e) {
            if (!this.canvasesHasDesigns()) {
                alert('Please design product');
                return;
            } else {
                ProductDesigner.prototype.reloadPrice();
                if (!ProductDesigner.prototype.addtocartbuttonclicked) {
                    ProductDesigner.prototype.reloadPrintingPrice(true);
                    ProductDesigner.prototype.addtocartbuttonclicked = 1;
                } else {
                    ProductDesigner.prototype.reloadPrintingPrice();
                }
                require(['jquery', 'Magento_Ui/js/modal/modal'], function($, modal) {
                    var options = {
                        type: 'popup',
                        responsive: true,
                        innerScroll: true,
                        modalClass: 'productdesigner-cart-add',
                        title: 'Add To Cart',
                        buttons: []
                    };
                    //var qtynull = 0.00;
                    var popup = modal(options, $('#add-to-cart'));
                    $('#add-to-cart').modal('openModal');
                });
            }
        }.bind(this));
    },
    reloadTierPrice: function(color_id) {
        jQuery('#pd_loading_img').show();
        jQuery.ajax({
            url: ProductDesigner.prototype.tierPriceUrl,
            method: 'post',
            data: {
                color_id: color_id,
                product_id: ProductDesigner.prototype.data.productId
            },
            success: function(data, textStatus, jqXHR) {
                require(['jquery'], function($) {
                    var response = JSON.parse(data);
                    jQuery("#customOptionFormProdSettings").html(response["price"]);
                    jQuery('#pd_loading_img').hide();
                });
            }
        });
    },
    observAddToCart: function() {
        jQuery("#cart-add").on("click", function() {
            if (!ProductDesigner.prototype.canvasesHasDesigns()) {
                alert('Please design product');
                return;
            } else {
                if (ProductDesigner.prototype.data.productType == "configurable") {
                    if (ProductDesigner.prototype.data.printing_method_avail != '0') {
                        var flag1 = false;
                        var qty = 0;
                        jQuery('.size-qty').each(function(val, index) {
                            if (index.value > 0) {
                                qty = parseInt(qty) + parseInt(index.value);
                            }
                            if (isNaN(index.value)) {
                                flag1 = true;
                            }
                        });
                        if (document.querySelector('input[name="printing_type"]:checked') != null) {
                            var selected_printing_method = document.querySelector('input[name="printing_type"]:checked').value;
                            if (flag1 == true) {
                                alert("Please specify proper quantity.");
                                return false;
                            }
                            if (qty < ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['minimum_quantity']) {
                                alert("For this method minimum required quantity is " + ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['minimum_quantity'] + ".");
                                return false;
                            }
                        } else if (qty == 0) {
                            alert("Please enter qty greater than 0.");
                            return false;
                        } else {
                            alert("Please Select Printing Method");
                            return false;
                        }
                    } else {
                        var flag1 = false;
                        var qty = 0;
                        jQuery('.size-qty').each(function(val, index) {
                            if (index.value > 0) {
                                qty = parseInt(qty) + parseInt(index.value);
                            }
                            if (isNaN(index.value)) {
                                flag1 = true;
                            }
                        });
                        if (qty == 0) {
                            alert("Please enter qty greater than 0.");
                            return false;
                        }
                    }
                } else {
                    var flag1 = false;
                    var qty = parseInt(jQuery('#qty').val());
                    if (ProductDesigner.prototype.data.printing_method_avail != '0') {
                        if (document.querySelector('input[name="printing_type"]:checked') != null) {
                            var selected_printing_method = document.querySelector('input[name="printing_type"]:checked').value;
                            if (isNaN(qty)) {
                                flag1 = true;
                            }
                            if (flag1 == true) {
                                alert("Please specify proper quantity.");
                                return false;
                            }
                            if (qty < ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['minimum_quantity']) {
                                alert("For this method minimum required quantity is " + ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['minimum_quantity'] + ".");
                                return false;
                            }
                        } else if (qty == 0) {
                            alert("Please enter qty greater than 0.");
                            return false;
                        } else {
                            alert("Please Select Printing Method");
                            return false;
                        }
                    } else {
                        if (isNaN(qty)) {
                            flag1 = true;
                        }
                        if (flag1 == true) {
                            alert("Please specify proper quantity.");
                            return false;
                        }
                        if (qty == 0) {
                            alert("Please enter qty greater than 0.");
                            return false;
                        }
                    }
                }
                if (ProductDesigner.prototype.multiper != 0 && ProductDesigner.prototype.multiper != "") {
                    setTimeout(function() {
                        jQuery("#cart-error-msg").html('');
                    }, 5000);
                    if (parseInt(jQuery("#qty").val()) % ProductDesigner.prototype.multiper != 0) {
                        jQuery("#cart-error-msg").html("Please enter multiple of " + ProductDesigner.prototype.multiper);
                        return false;
                    }
                }
                jQuery('#pd_loading_img').show();
                jQuery('#pd_loading_img').css("z-index", 9999);
                jQuery('.progress-bar-wrapper.add-to-cart').show();
                var progressInterval;
                progressInterval = setInterval(func2, 25);
                var i = 1;

                function func2() {
                    jQuery("#display1").text(parseInt(i) + '%');
                    jQuery("#progress_message1").text('Add to Cart Proceed...');
                    i++;
                    if (i == 100) {
                        clearInterval(progressInterval);
                        jQuery('.progress-bar-wrapper.add-to-cart').hide();
                    }
                }
                ProductDesigner.prototype.saveDesign(ProductDesigner.prototype.continueUrl, ProductDesigner.prototype.continueFunction);
            }
        });
    },
    observeZoomButton: function() {
        jQuery('#zoom_in').on('click', function(e) {
            var img = this.data.product.images[this.currentProductColor][this.currentProduct];
            this.resizeCanvas(img, this.currentImageId, 'in');
        }.bind(this));
        jQuery('#zoom_out').on('click', function(e) {
            var img = this.data.product.images[this.currentProductColor][this.currentProduct];
            this.resizeCanvas(img, this.currentImageId, 'out');
        }.bind(this));
    },
    resizeCanvas: function(product, id, type) {
        if (id) {
            product = this.data.product.images[this.currentProductColor][id];
        } else if (product == null) {
            product = this.data.product.images[this.currentProductColor][this.firstImageId];
        }
        var url = product.url;
        if (type) {
            if (!this.zoomInFactor) {
                this.zoomInFactor = parseFloat(ProductDesigner.prototype.scaleFactor) - parseFloat(0.4);
            }
            if (!this.zoomOutFactor) {
                this.zoomOutFactor = parseFloat(ProductDesigner.prototype.scaleFactor) + parseFloat(0.4);
            }
            if (type == 'in') {
                if (ProductDesigner.prototype.scaleFactor <= this.zoomInFactor) {
                    ProductDesigner.prototype.scaleFactor = ProductDesigner.prototype.scaleFactor;
                    jQuery('#zoom_in').parent().attr('disabled', 'disabled');
                    jQuery('#zoom_in').parent().addClass('disabled');
                } else {
                    ProductDesigner.prototype.scaleFactor = parseFloat(ProductDesigner.prototype.scaleFactor) - parseFloat(0.1);
                    this.zoomCount++;
                    if (this.zoomCount > 0) {
                        jQuery('#zoom_count').children().html('+' + this.zoomCount);
                    } else {
                        jQuery('#zoom_count').children().html(this.zoomCount);
                    }
                    jQuery('#zoom_out').parent().removeAttr('disabled');
                    jQuery('#zoom_out').parent().removeClass('disabled');
                }
            }
            if (type == 'out') {
                if (ProductDesigner.prototype.scaleFactor >= this.zoomOutFactor) {
                    ProductDesigner.prototype.scaleFactor = ProductDesigner.prototype.scaleFactor;
                    jQuery('#zoom_out').parent().attr('disabled', 'disabled');
                    jQuery('#zoom_out').parent().addClass('disabled');
                } else {
                    ProductDesigner.prototype.scaleFactor = parseFloat(ProductDesigner.prototype.scaleFactor) + parseFloat(0.1);
                    this.zoomCount--;
                    if (this.zoomCount > 0) {
                        jQuery('#zoom_count').children().html('+' + this.zoomCount);
                    } else {
                        jQuery('#zoom_count').children().html(this.zoomCount);
                    }
                    jQuery('#zoom_in').parent().removeAttr('disabled');
                    jQuery('#zoom_in').parent().removeClass('disabled');
                }
            }
        } else {
            if (window.innerWidth < 640) {
                if (window.innerWidth < 640 && window.innerWidth >= 480) {
                    ProductDesigner.prototype.scaleFactor = 1.4;
                }
                if (window.innerWidth < 480 && window.innerWidth >= 320) {
                    ProductDesigner.prototype.scaleFactor = 1.8;
                }
                if (window.innerWidth < 320) {
                    ProductDesigner.prototype.scaleFactor = 3.4;
                }
            } else {
                ProductDesigner.prototype.scaleFactor = 1;
                url = product.url;
            }
        }
        if (product.dim.length > 1) {
            for (var index in this.containerCanvases) {
                var index1 = index.split("&");
                var index2 = index1[0];
                if (index2 == ProductDesigner.prototype.currentProduct) {
                    var productNew = {};
                    var canvas = this.containerCanvases[index];
                    if (product.dim.length > 1) {
                        for (var i = 0; i < product.dim.length; i++) {
                            if (index1[1] == product.dim[i].design_area_id) {
                                productNew.dim = product.dim[i];
                                productNew.height = product.height;
                                productNew.width = product.width;
                                productNew.image_id = product.image_id;
                            }
                        }
                    }
                    var canvas = ProductDesigner.prototype.containerCanvases[index];
                    // var canvas = this.canvas;
                    //                    if (productNew.dim != undefined)
                    //                    {
                    var canvas_height = productNew.dim.height;
                    var canvas_width = productNew.dim.width;
                    var old_canvas_height = canvas.getHeight();
                    var old_canvas_width = canvas.getWidth();
                    canvas.setHeight(canvas_height * (1 / ProductDesigner.prototype.scaleFactor));
                    canvas.setWidth(canvas_width * (1 / ProductDesigner.prototype.scaleFactor));
                    if (product.masking_image_path != undefined) {
                        fabric.loadSVGFromURL(product.masking_image_path, function(objects, options) {
                            var cmd = new ObjectMaskingHistory(canvas, objects, options, product.masking_image_path, null);
                            cmd.exec();
                            History.prototype.push(cmd);
                        });
                    }
                    if (jQuery('#designArea-' + productNew.image_id + index1[1])) {
                        jQuery('#designArea-' + productNew.image_id + index1[1]).css("width", canvas.getWidth() + 'px');
                        jQuery('#designArea-' + productNew.image_id + index1[1]).css("height", canvas.getHeight() + 'px');
                    }
                    ProductDesigner.prototype.product_container.style.background = 'url(' + url + ') no-repeat center';
                    ProductDesigner.prototype.product_container.style.backgroundSize = '100% auto';
                    ProductDesigner.prototype.product_container.style.height = productNew.height * (1 / ProductDesigner.prototype.scaleFactor) + 'px';
                    ProductDesigner.prototype.product_container.style.width = productNew.width * (1 / ProductDesigner.prototype.scaleFactor) + 'px';
                    ProductDesigner.prototype.productImageSize = {
                        height: productNew.height * (1 / ProductDesigner.prototype.scaleFactor),
                        width: productNew.width * (1 / ProductDesigner.prototype.scaleFactor)
                    }
                    var he = productNew.height * (1 / ProductDesigner.prototype.scaleFactor);
                    var we = productNew.width * (1 / ProductDesigner.prototype.scaleFactor)
                    if (jQuery('#designArea-' + productNew.image_id + index1[1])) {
                        jQuery('#designArea-' + productNew.image_id + index1[1]).css("marginLeft", ((we * productNew.dim.x1) / productNew.width) + 'px');
                        jQuery('#designArea-' + productNew.image_id + index1[1]).css("marginTop", ((he * productNew.dim.y1) / productNew.height) + 'px');
                    }
                    // }
                    var objects = canvas.getObjects();
                    if (objects.length > 0) {
                        for (var i = 0; i < objects.length; i++) {
                            var scaleX = objects[i].scaleX;
                            var scaleY = objects[i].scaleY;
                            var left = objects[i].left;
                            var top = objects[i].top;
                            //if(this.scaleFactor < objects[i].old_scaleFactor)    //landscape => portriat
                            if (window.innerHeight > window.innerWidth) //landscape => portriat
                            {
                                //var scale_x = scaleX * (1 / this.scaleFactor);
                                var scale_x = (canvas.getWidth() * scaleX) / old_canvas_width; //var scale_y = scaleY * (1 / this.scaleFactor);
                                var scale_y = (canvas.getHeight() * scaleX) / old_canvas_height;
                            } else if (window.innerWidth > window.innerHeight) //portrait => landscape
                            {
                                //var scale_x = scaleX * (1 / this.scaleFactor);
                                var scale_x = (canvas.getWidth() * scaleY) / old_canvas_width;
                                //var scale_y = scaleY * (1 / this.scaleFactor);
                                var scale_y = (canvas.getHeight() * scaleY) / old_canvas_height;
                            } else //portriat = > landscape
                            {
                                var scale_x = scaleX * ProductDesigner.prototype.scaleFactor;
                                var scale_y = scaleY * ProductDesigner.prototype.scaleFactor;
                            }
                            var tempScaleX = scale_x;
                            var tempScaleY = scale_y;
                            //var tempScaleX = objects[i].old_scalex ? objects[i].old_scalex : scale_x;
                            //var tempScaleY = objects[i].old_scaley ? objects[i].old_scaley : scale_y;
                            var tempLeft = (canvas.getWidth() * left) / old_canvas_width;
                            var tempTop = (canvas.getHeight() * top) / old_canvas_height;
                            objects[i].scaleX = tempScaleX;
                            objects[i].scaleY = tempScaleY;
                            objects[i].left = tempLeft;
                            objects[i].top = tempTop;
                            objects[i].set({
                                old_scalex: scaleX,
                                old_scaley: scaleY,
                                old_top: top,
                                old_left: left,
                                old_scaleFactor: ProductDesigner.prototype.scaleFactor
                            });
                            objects[i].setCoords();
                        }
                    }
                    canvas.calcOffset();
                    canvas.renderAll();
                }
            }
        } else {
            var canvas = this.canvas;
            var canvas_height = product.dim.height;
            var canvas_width = product.dim.width;
            var old_canvas_height = canvas.getHeight();
            var old_canvas_width = canvas.getWidth();
            canvas.setHeight(canvas_height * (1 / ProductDesigner.prototype.scaleFactor));
            canvas.setWidth(canvas_width * (1 / ProductDesigner.prototype.scaleFactor));
            if (product.masking_image_path != undefined) {
                fabric.loadSVGFromURL(product.masking_image_path, function(objects, options) {
                    var cmd = new ObjectMaskingHistory(canvas, objects, options, product.masking_image_path, null);
                    cmd.exec();
                    History.prototype.push(cmd);
                });
            }
            if (jQuery('#designArea-' + product.image_id)) {
                jQuery('#designArea-' + product.image_id).css("width", canvas.getWidth() + 'px');
                jQuery('#designArea-' + product.image_id).css("height", canvas.getHeight() + 'px');
            }
            ProductDesigner.prototype.product_container.style.background = 'url(' + url + ') no-repeat center';
            ProductDesigner.prototype.product_container.style.backgroundSize = '100% auto';
            ProductDesigner.prototype.product_container.style.height = product.height * (1 / ProductDesigner.prototype.scaleFactor) + 'px';
            ProductDesigner.prototype.product_container.style.width = product.width * (1 / ProductDesigner.prototype.scaleFactor) + 'px';
            ProductDesigner.prototype.productImageSize = {
                height: product.height * (1 / ProductDesigner.prototype.scaleFactor),
                width: product.width * (1 / ProductDesigner.prototype.scaleFactor)
            }
            var he = product.height * (1 / ProductDesigner.prototype.scaleFactor);
            var we = product.width * (1 / ProductDesigner.prototype.scaleFactor)
            if (jQuery('#designArea-' + product.image_id)) {
                jQuery('#designArea-' + product.image_id).css("marginLeft", ((we * product.dim.x1) / product.width) + 'px');
                jQuery('#designArea-' + product.image_id).css("marginTop", ((he * product.dim.y1) / product.height) + 'px');
            }
            var objects = canvas.getObjects();
            if (objects.length > 0) {
                for (var i = 0; i < objects.length; i++) {
                    var scaleX = objects[i].scaleX;
                    var scaleY = objects[i].scaleY;
                    var left = objects[i].left;
                    var top = objects[i].top;
                    //if(this.scaleFactor < objects[i].old_scaleFactor)    //landscape => portriat
                    if (window.innerHeight > window.innerWidth) //landscape => portriat
                    {
                        //var scale_x = scaleX * (1 / this.scaleFactor);
                        var scale_x = (canvas.getWidth() * scaleX) / old_canvas_width;
                        //var scale_y = scaleY * (1 / this.scaleFactor);
                        var scale_y = (canvas.getHeight() * scaleX) / old_canvas_height;
                    } else if (window.innerWidth > window.innerHeight) //portrait => landscape
                    {
                        //var scale_x = scaleX * (1 / this.scaleFactor);
                        var scale_x = (canvas.getWidth() * scaleY) / old_canvas_width;
                        //var scale_y = scaleY * (1 / this.scaleFactor);
                        var scale_y = (canvas.getHeight() * scaleY) / old_canvas_height;
                    } else //portriat = > landscape
                    {
                        var scale_x = scaleX * ProductDesigner.prototype.scaleFactor;
                        var scale_y = scaleY * ProductDesigner.prototype.scaleFactor;
                    }
                    var tempScaleX = scale_x;
                    var tempScaleY = scale_y;
                    //var tempScaleX = objects[i].old_scalex ? objects[i].old_scalex : scale_x;
                    //var tempScaleY = objects[i].old_scaley ? objects[i].old_scaley : scale_y;
                    var tempLeft = (canvas.getWidth() * left) / old_canvas_width;
                    var tempTop = (canvas.getHeight() * top) / old_canvas_height;
                    objects[i].scaleX = tempScaleX;
                    objects[i].scaleY = tempScaleY;
                    objects[i].left = tempLeft;
                    objects[i].top = tempTop;
                    objects[i].set({
                        old_scalex: scaleX,
                        old_scaley: scaleY,
                        old_top: top,
                        old_left: left,
                        old_scaleFactor: ProductDesigner.prototype.scaleFactor
                    });
                    objects[i].setCoords();
                }
            }
            canvas.calcOffset();
            canvas.renderAll();
        }
        this.observeWindowResize();
        //$('product_designer_main_content').style.visibility= "visible";
    },
    observeWindowResize: function() {
        var a;
        jQuery(window).resize(function() {
            product = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct];
            if (ProductDesigner.windowWidth != window.innerWidth) {
                clearTimeout(a);
                a = setTimeout(function() {
                    ProductDesigner.prototype.resizeCanvas(product);
                }, 1000);
            }
            ProductDesigner.prototype.windowWidth = window.innerWidth;
            ProductDesigner.prototype.windowHeight = window.innerHeight;
        });
    },
    observePreviewButton: function() {
        jQuery('#preview_btn').on('click', function(e) {
            //e.stop();
            this.createPreviewWindow();
            //this.previewWindow.showCenter(true);
            // this._toggleControlsButtons();
        }.bind(this));
    },
    createPreviewWindow: function() {
        var flag = 0;
        if (!this.previewWindow) {
            if (!ProductDesigner.prototype.canvasesHasDesigns()) {
                alert('Please design product');
                return;
            }
            jQuery('#pd_loading_img').show();
            var data = {};
            var colorImages = ProductDesigner.prototype.reStuctureImagesObject(ProductDesigner.prototype.data.product.images);
            var images = {};
            var parentImageId = {};
            for (var imageId in ProductDesigner.prototype.containerCanvases) {
                var index1 = imageId.split("&");
                var index2 = index1[0];
                if (ProductDesigner.prototype.containerCanvases.hasOwnProperty(imageId) && colorImages.hasOwnProperty(imageId) && index2 == ProductDesigner.prototype.currentProduct) {
                    var canvas = ProductDesigner.prototype.containerCanvases[imageId];
                    if (canvas.getObjects().length > 0) {
                        canvas.deactivateAll();
                        canvas.renderAll();
                        var image = canvas.toDataURLWithMultiplier('png', ProductDesigner.prototype.scaleFactor);
                        image = image.substr(image.indexOf(',') + 1).toString();
                        images[imageId] = image;
                        var parentImage = imageId.split("&")[0];
                        if (ProductDesigner.prototype.ImageMultipleArray['@' + ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][parentImage].image_id]) {
                            parentImageId[imageId] = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][parentImage].dim[0].image_id;
                            flag = 1;
                        } else {
                            parentImageId[imageId] = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][parentImage].dim.image_id;
                            flag = 1;
                        }
                    }
                }
            }
            if (flag == 1) {
                var params = getUrlParams();
                data['id'] = params['id'];
                data['images'] = JSON.stringify(images);
                data['parentImageId'] = JSON.stringify(parentImageId);
                data['image_id'] = ProductDesigner.prototype.currentProduct;
                var is_config = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].is_configurable;
                if (is_config == 1 && !ProductDesigner.prototype.isAdmin) {
                    if (ProductDesigner.prototype.currentProductColor) {
                        data['color'] = this.currentProductColor;
                    }
                }
                jQuery.ajax({
                    url: ProductDesigner.prototype.previewImageUrl,
                    method: 'post',
                    data: {
                        data: data
                    },
                    success: function(data, textStatus, jqXHR) {
                        jQuery('#pd_loading_img').hide();
                        require(['jquery', 'Magento_Ui/js/modal/alert'], function($, alert) {
                            alert({
                                modalClass: 'productdesigner-preview',
                                title: "Design Preview",
                                height: '100px',
                                width: '100px',
                                content: JSON.parse(data),
                                actions: {
                                    always: function() {
                                        //console.log("modal closed");
                                    }
                                }
                            });
                        });
                    }
                });
            } else {
                jQuery('#pd_loading_img').hide();
                alert("please design product for current side");
            }
        }
    },
    createImagePreview: function() {
        if (this.data.product.images[this.currentProductColor][this.currentProduct].url == undefined) {
            return;
        }
        var bgimgUrl = this.data.product.images[this.currentProductColor][this.currentProduct].url;
        var canvas = jQuery('#product-zoom-canvas');
        canvas.innerHTML = '';
        jQuery('#product-zoom-container').html('');
        jQuery('#product-zoom-canvas').attr("width", parseInt(this.imageSize.width));
        jQuery('#product-zoom-canvas').attr("height", parseInt(this.imageSize.height));
        // canvas.style.border = '1px dashed';
        jQuery('#product-zoom-container').append(canvas);
        var zoomCanvas = new fabric.Canvas(canvas[0]);
        fabric.Image.fromURL(bgimgUrl, function(backgroundobj) {
            backgroundobj.lockMovementX = true;
            backgroundobj.lockMovementY = true;
            var group = new fabric.Group([], {
                left: 0,
                top: 0,
                originX: 'center',
                originY: 'center',
                hasControls: false,
                hasBorders: false
            });
            this.currCanvasGroup = group;
            this.currCanvasGroup.add(backgroundobj);
            for (var index in this.containerCanvases) {
                var index1 = index.split("&");
                var index2 = index1[0];
                if (index2 == this.currentProduct) {
                    var canvas = this.containerCanvases[index];
                    canvas.deactivateAll();
                    canvas.renderAll();
                    fabric.Image.fromURL(canvas.toDataURL(), function(obj) {
                        var desigImage = this.prepareImageForPreview(obj, index, this.currentProduct);
                        this.currCanvasGroup.add(obj);
                        group.padding = this.imageSize.width > this.imageSize.height ? this.imageSize.width : this.imageSize.height;
                        zoomCanvas.clear().renderAll();
                        zoomCanvas.add(this.currCanvasGroup);
                        zoomCanvas.setActiveObject(group);
                        zoomCanvas.renderAll();
                    }.bind(this), {
                        "designId": index,
                        "currentProduct": this.currentProduct,
                        "id": index1[1]
                    })
                }
            };
        }.bind(this));
    },
    createPreviewImage: function() {
        //        if (ProductDesigner.prototype.data.product.images[this.currentProductColor][this.currentProduct].url == undefined) {
        //            return;
        var bgimgUrl = this.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].url;
        var canvas = jQuery('#product-zoom-canvas');
        canvas.html('');
        jQuery('#product-zoom-container').html('');
        canvas.attr('width', parseInt(ProductDesigner.prototype.imageSize.width));
        canvas.attr('height', parseInt(ProductDesigner.prototype.imageSize.height));
        // canvas.style.border = '1px dashed';
        jQuery('#product-zoom-container').append(canvas);
        var zoomCanvas = new fabric.Canvas(canvas[0]);
        fabric.Image.fromURL(bgimgUrl, function(backgroundobj) {
            backgroundobj.lockMovementX = true;
            backgroundobj.lockMovementY = true;
            var group = new fabric.Group([], {
                left: 0,
                top: 0,
                originX: 'center',
                originY: 'center',
                hasControls: false,
                hasBorders: false
            });
            this.currCanvasGroup = group;
            this.currCanvasGroup.add(backgroundobj);
            for (var index in ProductDesigner.prototype.containerCanvases) {
                var index1 = index.split("&");
                var index2 = index1[0];
                if (index2 == ProductDesigner.prototype.currentProduct) {
                    var canvas = ProductDesigner.prototype.containerCanvases[index];
                    canvas.deactivateAll();
                    canvas.renderAll();
                    fabric.Image.fromURL(canvas.toDataURL(), function(obj) {
                        var desigImage = ProductDesigner.prototype.prepareImageForPreview(obj, index, ProductDesigner.prototype.currentProduct);
                        this.currCanvasGroup.add(obj);
                        group.padding = ProductDesigner.prototype.imageSize.width > ProductDesigner.prototype.imageSize.height ? ProductDesigner.prototype.imageSize.width : ProductDesigner.prototype.imageSize.height;
                        zoomCanvas.clear().renderAll();
                        zoomCanvas.add(this.currCanvasGroup);
                        zoomCanvas.setActiveObject(group);
                        zoomCanvas.renderAll();
                    }.bind(this), {
                        "designId": index,
                        "currentProduct": ProductDesigner.prototype.currentProduct,
                        "id": index1[1]
                    })
                }
            };
        }.bind(this));
    },
    prepareImageForPreview: function(obj) {
        var index = obj.designId;
        var currentProduct = obj.currentProduct;
        var index1 = index.split("&");
        var designID = index1[1];
        var currentImg = this.data.product.images[this.currentProductColor][currentProduct];
        var origImage = this.data.product.images[this.currentProductColor][currentProduct];
        if (currentImg.dim.length > 1) {
            for (var i = 0; i < currentImg.dim.length; i++) {
                if (designID == currentImg.dim[i].design_area_id) {
                    var currentImgNew = {};
                    currentImgNew.dim = currentImg.dim[i];
                    currentImgNew.height = currentImg.height;
                    currentImgNew.width = currentImg.width;
                    var origImageNew = {};
                    origImageNew.dim = currentImg.dim[i];
                    origImageNew.height = currentImg.height;
                    origImageNew.width = currentImg.width;
                }
            }
        } else {
            var origImageNew = origImage;
            var currentImgNew = currentImg;
        }
        var windowWidth = canWidth = currentImgNew.width;
        var windowHeight = canHeight = currentImgNew.height;
        var orig_height = origImageNew.height;
        var orig_width = origImageNew.width;
        if ((orig_width / orig_height) >= windowWidth / windowHeight) {
            var canHeight = Math.round((windowWidth / orig_width) * orig_height);
            var scale = orig_width / windowWidth;
        } else {
            var canWidth = Math.round((windowHeight / orig_height) * orig_width)
            var scale = orig_height / windowHeight;
        }
        var widthScale = orig_width / canWidth;
        var heightScale = orig_height / canHeight;
        obj.set({
            width: Math.round(currentImgNew.dim.width * widthScale),
            height: Math.round(currentImgNew.dim.height * heightScale),
            top: Math.round(currentImgNew.dim.y1 * scale) - (windowHeight - canHeight),
            left: Math.round(currentImgNew.dim.x1 * scale) - (windowWidth - canWidth),
            // originY: Math.round(currentImgNew.dim.y1 * scale) - (windowHeight - canHeight),                                 // originX: Math.round(currentImgNew.dim.x1 * scale) - (windowWidth - canWidth),
            hasControls: false,
            hasBorders: false
        });
        return obj;
    },
    observeSaveDesignButton: function() {
        if (jQuery('#save_design_btn')) {
            jQuery('#save_design_btn').on('click', function(e) {
                if (!this.canvasesHasDesigns()) {
                    alert('Please design product');
                    return;
                }
                if (this.isCustomerLogin == '0') {
                    this.createLoginPreviewWindow();
                } else if (this.isCustomerLogin == '1') {
                    this.saveDesign(this.saveDesignUrl, this.saveDesignFunction);
                }
            }.bind(this));
        }
    },
    observeRegisterBtn: function() {
        if (jQuery('#customer-register-btn')) {
            jQuery('#customer-register-btn').on('click', function(e) {
                this.createRegistrationWindow();
            }.bind(this));
        }
    },
    observRegisterSubmitBtn: function() {
        if (jQuery('#customer-register-submit-btn')) {
            jQuery('#customer-register-submit-btn').on('click', function(e) {
                var type = 'register';
                this.loginAndSaveDesign(this.registerUrl, 'form-validate', type);
                return;
            }.bind(this));
        }
    },
    createRegistrationWindow: function() {
        jQuery('#customer-login-container').modal('closeModal');
        require(['jquery', 'Magento_Ui/js/modal/modal'], function($, modal) {
            var options = {
                type: 'popup',
                responsive: true,
                innerScroll: true,
                width: 500,
                modalClass: 'productdesigner-register',
                title: 'Customer Registration',
                buttons: []
            };
            var popup = modal(options, jQuery('#customer-register-container'));
            jQuery('#customer-register-container').modal('openModal');
        });
    },
    createLoginPreviewWindow: function() {
        require(['jquery', 'Magento_Ui/js/modal/modal'], function($, modal) {
            var options = {
                type: 'popup',
                responsive: true,
                innerScroll: true,
                modalClass: 'productdesigner-login',
                title: 'Customer Login',
                buttons: []
            };
            var popup = modal(options, $('#customer-login-container'));
            $('#customer-login-container').modal('openModal');
        });
    },
    observeLoginBtn: function() {
        if (jQuery('#customer-login-btn')) {
            jQuery('#customer-login-btn').on('click', function(e) {
                if (jQuery('#customer-login-btn').valid()) {
                    var type = 'login';
                    this.loginAndSaveDesign(this.loginUrl, 'login-form-pd', type);
                    return;
                }
            }.bind(this));
        }
    },
    observeGetStoredDesignButton: function() {
        if (this.isCustomerLogin == '0') {
            if (jQuery('#get_stored_designs')) {
                jQuery('#get_stored_designs').live('click', function(e) {
                    if (this.isCustomerLogin == '0') {
                        this.createLoginPreviewWindow();
                    } else if (this.isCustomerLogin == '1') {}
                }.bind(this));
            }
        }
    },
    loginAndSaveDesign: function(url, formId, type) {
        var form_login = jQuery('#' + formId);
        if (jQuery('#' + formId).valid()) {
            jQuery('#pd_loading_img').css("z-index", "999");
            jQuery('#pd_loading_img').show();
            var elements = form_login[0].elements;
            var login_data = {};
            for (var index in elements) {
                if (elements.hasOwnProperty(index)) {
                    var elm = elements[index];
                    if (typeof elm == "object" && (elm.tagName == 'INPUT' || elm.tagName == 'SELECT')) {
                        if (elm.type == 'checkbox') {
                            login_data[elm.name] = elm.checked
                        } else {
                            login_data[elm.name] = jQuery(elm).val();
                        }
                    }
                }
            }
            var design = 0;
            for (var imageId in ProductDesigner.prototype.containerCanvases) {
                design = design + ProductDesigner.prototype.containerCanvases[imageId].getObjects().length;
            }
            var imagesData = this.prepareImagesForSave();
            jQuery.ajax({
                url: url,
                method: 'post',
                data: login_data,
                success: function(data, textStatus, jqXHR) {
                    var response = JSON.parse(data);
                    if (response.status == 'success') {
                        ProductDesigner.prototype.isCustomerLogin = '1';
                        jQuery('#' + type + '-error-msg').html('');
                        if (design == 0) {
                            jQuery.ajax({
                                url: ProductDesigner.prototype.getmydesign,
                                method: 'post',
                                success: function(data, textStatus, jqXHR) {
                                    jQuery('#pd_loading_img').hide();
                                    var response = JSON.parse(data);
                                    ProductDesigner.prototype.designIdSave = response.design_id;
                                    if (response.designs) {
                                        if (jQuery('#mydesigns_images_container') != undefined) jQuery('#mydesigns_images_container').html(response.designs);
                                        jQuery('#customer-login-container').modal('closeModal');
                                    }
                                }
                            });
                        } else {
                            jQuery.ajax({
                                url: ProductDesigner.prototype.saveDesignUrl,
                                method: 'post',
                                data: {
                                    data: imagesData
                                },
                                success: function(data, textStatus, jqXHR) {
                                    jQuery('#pd_loading_img').hide();
                                    var responsesave = JSON.parse(data);
                                    ProductDesigner.prototype.designIdSave = responsesave.design_id;
                                    if (responsesave.designs) {
                                        if (jQuery('#mydesigns_images_container') != undefined) jQuery('#mydesigns_images_container').html(responsesave.designs);
                                    }
                                    jQuery('#customer-register-btn').addClass('disabled');
                                    jQuery('#customer-register-btn').attr('disabled', 'disabled');
                                    jQuery('#customer-login-btn').addClass('disabled');
                                    jQuery('#customer-login-btn').attr('disabled', 'disabled');
                                    if (type == 'login') {
                                        jQuery('#customer-login-container').modal('closeModal');
                                    } else if (type == 'register') {
                                        jQuery('#customer-register-container').modal('closeModal');
                                    }
                                    ProductDesigner.prototype.designChanged[ProductDesigner.prototype.currentProductColor] = false;
                                    ProductDesigner.prototype.designId[ProductDesigner.prototype.currentProductColor] = responsesave.design_id;
                                    ProductDesigner.prototype._observeNavButtons('disabled');
                                    ProductDesigner.prototype._observeControlButtons();
                                    alert('Design was saved successfully.');
                                    // Windows.closeAll();
                                    setTimeout(function() {
                                        ProductDesigner.prototype.fbUrl = responsesave.fbshare;
                                        ProductDesigner.prototype.twUrl = responsesave.twshare;
                                        ProductDesigner.prototype.gUrl = responsesave.gshare;
                                        ProductDesigner.prototype.piUrl = responsesave.pinshare;
                                        if (ProductDesigner.prototype.clickedSocialButton != null) {
                                            if (ProductDesigner.prototype.clickedSocialButton == 'fb_share') {
                                                //window.open(responsesave.fbshare);
                                                facebook_share(ProductDesigner.prototype.data.productId, ProductDesigner.prototype.designIdSave);
                                            } else if (ProductDesigner.prototype.clickedSocialButton == 'tw_share') {
                                                window.open(responsesave.twshare);
                                            } else if (ProductDesigner.prototype.clickedSocialButton == 'g_share') {
                                                //window.open(responsesave.gshare);
                                                google_share(ProductDesigner.prototype.data.productId, ProductDesigner.prototype.designIdSave);
                                            } else if (ProductDesigner.prototype.clickedSocialButton == 'pin_share') {
                                                window.open(responsesave.pinshare);
                                            } else if (ProductDesigner.prototype.clickedSocialButton == 'email_share') {
                                                require(['jquery', 'Magento_Ui/js/modal/modal'], function($, modal) {
                                                    var options = {
                                                        type: 'popup',
                                                        responsive: true,
                                                        innerScroll: true,
                                                        modalClass: 'email-share-window',
                                                        title: 'Send to Friend',
                                                        buttons: []
                                                    };
                                                    var popup = modal(options, $('#email-share-window'));
                                                    $('#email-share-window').modal('openModal');
                                                });
                                                return;
                                            }
                                            ProductDesigner.prototype.clickedSocialButton = null;
                                        }
                                    }.bind(this), 600);
                                }
                            });
                        }
                    } else if (response.status == 'redirect' && response.url) {
                        jQuery('#pd_loading_img').hide();
                        window.top.location.href = response.url;
                    } else if (response.status == 'fail' && response.error) {
                        jQuery('#pd_loading_img').hide();
                        jQuery('#' + type + '-error-msg').html('');
                        jQuery('#' + type + '-error-msg').html(response.error);
                        jQuery('#customer-register-btn').removeClass('disabled');
                        jQuery('#customer-register-btn').removeAttr('disabled');
                        jQuery('#customer-login-btn').removeClass('disabled');
                        jQuery('#customer-login-btn').removeAttr('disabled');
                    }
                }
            });
        }
    },
    reloadPrintingPrice: function(isclicked) {
        var params = getUrlParams();
        if (!this.isadmin) var imagesPrice = 0.0;
        var textsPrice = 0.0;
        var customImagesPrice = 0.0;
        var fixedPrice = 0.0;
        var fixed
        var subTotal = 0.0;
        var side_count = Array();
        var area_by_side = {};
        var area_by_side1 = {};
        var side_by_area = {};
        var side_by_area_dim = {};
        var color_by_side = {};
        var type_by_side = {};
        this.designerPrices = {};
        if (this.prices.fixed_price > 0) {
            fixedPrice = parseFloat(this.prices.fixed_price);
            var fixedPriceConfig = {
                price: fixedPrice,
                type: "fixed"
            };
            subTotal += fixedPrice;
            if (OptionsPrice != undefined) {
                OptionsPrice.addCustomPrices('fixed_price', fixedPriceConfig);
            }
            this.designerPrices['fixed_price'] = fixedPrice;
        }
        var area_size = Array();
        var SumArea = 0.0;
        this.productDesigner = ProductDesigner.prototype;
        var canvas = ProductDesigner.prototype.canvas;
        for (var id in ProductDesigner.prototype.containerCanvases) {
            var obj_types = Array();
            var object_color_by_side = Array();
            var object_color_by_side_new = Array();
            var totalarea = Array();
            var canvas = ProductDesigner.prototype.containerCanvases[id];
            var designAreaPrice = 0;
            if (canvas && canvas != 'undefined') {
                var canvasCount = canvas.getObjects().length;
                if (canvasCount > 0) {
                    var object = canvas.getObjects();
                    for (var i = 0; i < object.length; i++) {
                        if (object[i].obj_side == '' || object[i].obj_side == undefined) {
                            object[i].obj_side = current_side = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].side;
                        }
                        side_count.push(object[i].obj_side);
                    }
                    var designArea = this.data.product.images[this.currentProductColor][id];
                    var imagesCount = 0;
                    var textsCount = 0;
                    var customImagesCount = 0;
                    var imagePrice = parseFloat(this.prices.image_price);
                    var textPrice = parseFloat(this.prices.text_price);
                    var bigNamePrice = parseFloat(this.prices.big_name_price);
                    var bigNumberPrice = parseFloat(this.prices.big_number_price);
                    var customImagePrice = parseFloat(this.prices.custom_image_price);
                    var largest_top = 0;
                    var largest_left = 0;
                    var lowest_top = 0;
                    var lowest_left = 0;
                    var height = 0;
                    var width = 0;
                    var max = -Infinity;
                    var current_side = '';
                    for (var i = 0; i < object.length; i++) {
                        current_side = object[i].obj_side;
                        side_count.push(object[i].obj_side);
                        obj_types.push(object[i].type);
                        var currentImg = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct];
                        if (currentImg.dim.length > 1) {
                            lowest_top = parseFloat(object[i].DesignAreaHeightNew);
                            lowest_left = parseFloat(object[i].DesignAreaWidthNew);
                        } else {
                            var design_area_height = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].dim.height;
                            var design_area_width = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].dim.width;
                            var oheight = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].dim.oheight;
                            var owidth = ProductDesigner.prototype.data.product.images[ProductDesigner.prototype.currentProductColor][ProductDesigner.prototype.currentProduct].dim.owidth;
                            var lowest_top = design_area_height;
                            var lowest_left = design_area_width;
                        }
                        // type_by_side
                        if (object[i].type == 'text') {
                            textsCount++;
                            object_color_by_side.push(object[i].used_colors);
                            if (textPrice > 0) {
                                textsPrice += textPrice;
                                subTotal += textPrice;
                            }
                        } else if ((object[i].type == 'path-group') || (object[i].type == 'path')) {
                            object_color_by_side.push(object[i].used_colors);
                            imagesCount++;
                            if (imagePrice > 0) {
                                imagesPrice += imagePrice;
                                subTotal += imagePrice;
                            }
                        } else if (object[i].type == 'image') {
                            object_color_by_side.push(object[i].used_colors);
                            if (object[i].tab == 'design') {
                                imagesCount++;
                                if (imagePrice > 0) {
                                    imagesPrice += imagePrice;
                                    subTotal += imagePrice;
                                }
                            } else if (object[i].tab == 'upload') {
                                customImagesCount++;
                                if (customImagePrice > 0) {
                                    customImagesPrice += customImagePrice;
                                    subTotal += customImagePrice;
                                }
                            }
                        }
                        if (parseFloat(object[i].top) >= parseFloat(largest_top) || parseFloat(object[i].top) < 0) {
                            largest_top = object[i].currTopObjNew;
                            if (parseFloat(height) < parseFloat(object[i].currHeightObjNew)) {
                                height = object[i].currHeightObjNew;
                            }
                        }
                        if (parseFloat(object[i].top) < parseFloat(lowest_top)) {
                            lowest_top = object[i].currTopObjNew;
                            if (largest_top < 0) {
                                largest_top = -largest_top;
                            }
                        }
                        if (parseFloat(object[i].left) >= parseFloat(largest_left) || parseFloat(object[i].left) < 0) {
                            largest_left = object[i].currLeftObjNew;
                            if (parseFloat(width) < parseFloat(object[i].currWidthObjNew)) {
                                width = object[i].currWidthObjNew;
                            }
                        }
                        if (parseFloat(object[i].left) < parseFloat(lowest_left)) {
                            lowest_left = object[i].currLeftObjNew;
                            if (lowest_left < 0) {
                                lowest_left = -lowest_left;
                            }
                        }
                        largest_top = parseFloat(largest_top) + parseFloat(height);
                        largest_left = parseFloat(largest_left) + parseFloat(width);
                        if (ProductDesigner.prototype.data.base_unit == "cm") {
                            var total_height = ((parseFloat(largest_top) - parseFloat(lowest_top))) / 37.79;
                            var total_width = ((parseFloat(largest_left) - parseFloat(lowest_left))) / 37.79;
                            var extralarge_area_end = (ProductDesigner.prototype.data.area.extralarge_area_end) / 37.79;
                            var large_area_end = (ProductDesigner.prototype.data.area.large_area_end) / 37.79;
                            var medium_area_end = (ProductDesigner.prototype.data.area.medium_area_end) / 37.79;
                            var small_area_end = (ProductDesigner.prototype.data.area.small_area_end) / 37.79;
                            var scaleFactor = 1;
                        } else if (ProductDesigner.prototype.data.base_unit == "px") {
                            var total_height = ((parseFloat(largest_top) - parseFloat(lowest_top)));
                            var total_width = ((parseFloat(largest_left) - parseFloat(lowest_left)));
                            var extralarge_area_end = ProductDesigner.prototype.data.area.extralarge_area_end;
                            var large_area_end = ProductDesigner.prototype.data.area.large_area_end;
                            var medium_area_end = ProductDesigner.prototype.data.area.medium_area_end;
                            var small_area_end = ProductDesigner.prototype.data.area.small_area_end;
                            var scaleFactor = 1;
                        }
                        var p_area = total_width * total_height;
                        var area = (parseFloat(p_area));
                        if (window.innerWidth < 640) {
                            if (window.innerWidth < 640 && window.innerWidth >= 480) {
                                scaleFactor = 1.4;
                                extralarge_area_end = extralarge_area_end * (1 / scaleFactor);
                                large_area_end = large_area_end * (1 / scaleFactor);
                                medium_area_end = medium_area_end * (1 / scaleFactor);
                                small_area_end = small_area_end * (1 / scaleFactor);
                                area = area * (1 / scaleFactor);
                            }
                            if (window.innerWidth < 480 && window.innerWidth >= 360) {
                                scaleFactor = 1.8;
                                extralarge_area_end = extralarge_area_end * (1 / scaleFactor);
                                large_area_end = large_area_end * (1 / scaleFactor);
                                medium_area_end = medium_area_end * (1 / scaleFactor);
                                small_area_end = small_area_end * (1 / scaleFactor);
                                area = area * (1 / scaleFactor);
                            }
                            if (window.innerWidth < 360 && window.innerWidth >= 320) {
                                scaleFactor = 2.3;
                                extralarge_area_end = extralarge_area_end * (1 / scaleFactor);
                                large_area_end = large_area_end * (1 / scaleFactor);
                                medium_area_end = medium_area_end * (1 / scaleFactor);
                                small_area_end = small_area_end * (1 / scaleFactor);
                                area = area * (1 / scaleFactor);
                            }
                            if (window.innerWidth < 320) {
                                scaleFactor = 3.4;
                                extralarge_area_end = extralarge_area_end * (1 / scaleFactor);
                                large_area_end = large_area_end * (1 / scaleFactor);
                                medium_area_end = medium_area_end * (1 / scaleFactor);
                                small_area_end = small_area_end * (1 / scaleFactor);
                                area = area * (1 / scaleFactor);
                            }
                        }
                        totalarea.push(area);
                        for (k = 0; k < totalarea.length; k++) {
                            SumArea += totalarea[k];
                        }
                        if (ProductDesigner.prototype.data.base_unit == "cm") {
                            if (parseFloat(SumArea) > 1200) {
                                SumArea = 1200;
                            }
                        } else if (ProductDesigner.prototype.data.base_unit == "px") {
                            if (parseFloat(SumArea) > 50000) {
                                SumArea = 50000;
                            }
                        }
                        if (parseFloat(SumArea) <= parseFloat(extralarge_area_end)) {
                            var size = 'extralarge';
                        }
                        if (parseFloat(SumArea) <= parseFloat(large_area_end)) {
                            var size = 'large';
                        }
                        if (parseFloat(SumArea) <= parseFloat(medium_area_end)) {
                            var size = 'medium';
                        }
                        if (parseFloat(SumArea) <= parseFloat(small_area_end)) {
                            var size = 'small';
                        }
                        if (parseFloat(SumArea) > parseFloat(extralarge_area_end)) {
                            var size = 'extralarge';
                        }
                        area_size.push(current_side + '_' + size);
                        area_by_side[size] = current_side;
                        area_by_side1[size + '_' + current_side] = current_side;
                        side_by_area[current_side] = size;
                        side_by_area_dim[current_side] = area;
                        if (object_color_by_side.length > 0) {
                            for (var a = 0; a < object_color_by_side.length; a++) {
                                var colr_arry = object_color_by_side[a];
                                if (colr_arry) {
                                    for (b = 0; b < colr_arry.length; b++) {
                                        object_color_by_side_new.push(colr_arry[b]);
                                    }
                                }
                            }
                            object_color_by_side_new = jQuery.unique(object_color_by_side_new);
                            color_by_side[current_side] = object_color_by_side_new.length;
                        }
                        if (this.designerPrices['image'] == undefined) {
                            this.designerPrices['image'] = {};
                        }
                        var newObjectImageId = id.replace("@", "");
                        this.designerPrices['image'][newObjectImageId] = designAreaPrice + (imagePrice * imagesCount) + (textPrice * textsCount) + (customImagePrice * customImagesCount);
                        var text_count = this.designerPrices['text_count'];
                        var image_count = this.designerPrices['image_count'];
                        var custom_image_count = this.designerPrices['custom_image_count'];
                        if (this.designerPrices['text_count'] == undefined) {
                            this.designerPrices['text_count'] = textsCount;
                        } else {
                            this.designerPrices['text_count'] += textsCount;
                        }
                        if (this.designerPrices['image_count'] == undefined) {
                            this.designerPrices['image_count'] = imagesCount;
                        } else {
                            this.designerPrices['image_count'] += imagesCount;
                        }
                        if (this.designerPrices['custom_image_count'] == undefined) {
                            this.designerPrices['custom_image_count'] = customImagesCount;
                        } else {
                            this.designerPrices['custom_image_count'] += customImagesCount;
                        }
                        obj_types = jQuery.unique(obj_types);
                        type_by_side[current_side] = obj_types;
                    }
                }
            }
        }
        this.designerPrices['sub_total'] = subTotal;
        this.designerPrices['text_price'] = textsPrice;
        this.designerPrices['image_price'] = imagesPrice;
        this.designerPrices['custom_image_price'] = customImagesPrice;
        if (OptionsPrice != undefined) {
            OptionsPrice.addCustomPrices('fixed_price', {
                price: fixedPrice,
                type: 'fixed'
            });
            OptionsPrice.addCustomPrices('design_text_price', {
                price: textsPrice,
                type: 'fixed'
            });
            OptionsPrice.addCustomPrices('design_image_price', {
                price: imagesPrice,
                type: 'fixed'
            });
            OptionsPrice.addCustomPrices('design_custom_image_price', {
                price: customImagesPrice,
                type: 'fixed'
            });
            OptionsPrice.setDuplicateIdSuffix('-design');
            OptionsPrice.reload();
        }
        if (!ProductDesigner.prototype.isAdmin) {
            var qty = 0;
            var total_price = parseFloat(jQuery('#product_price').val()) + parseFloat(subTotal);
            var price = total_price;
            var selected_qty = Array();
        }
        var newdesignerprice = 0;
        jQuery('.size-qty').each(function(index, val) {
            var selected_qty_details = {};
            if (val.value > 0) {
                qty = parseInt(qty) + parseInt(val.value);
                selected_qty_details.sizeId = jQuery(this).parent().parent().attr('data-size_id');
                selected_qty_details.qty = val.value;
                selected_qty.push(selected_qty_details);
                newdesignerprice += OptionsPrice.customPrices.fixed_price.price + OptionsPrice.customPrices.design_image_price.price + OptionsPrice.customPrices.design_text_price.price + OptionsPrice.customPrices.design_custom_image_price.price;
            }
        });
        side_count = jQuery.unique(side_count);
        if (qty == 0) qty = 1;
        price *= qty;
        var final_qty = qty;
        var array = [];
        var customtotalprice = 0;
        if (document.querySelector('input[name="printing_type"]:checked') != null) {
            var price = 0;
            var product_id = ProductDesigner.prototype.data.productId;
            var selected_printing_method = document.querySelector('input[name="printing_type"]:checked').value;
            //custom optioin code add in button start
            var allarray = this.data.product.allcustom_option;
            for (var all in allarray) {
                var custoptionid = allarray[all].option_id;
                if (allarray[all].type == "drop_down") {
                    var custoptionid = allarray[all].option_id;
                    if (($j("#select_" + custoptionid)[0].value != "")) {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[$j("#select_" + custoptionid)[0].value].price);
                    }
                }
                if (allarray[all].type == "radio") {
                    var custoptionid = allarray[all].option_id;
                    if (document.querySelector('input[name="options[' + custoptionid + ']"]:checked') != null) {
                        var selectedradioval = document.querySelector('input[name="options[' + custoptionid + ']"]:checked').value;
                        if (selectedradioval != '' || selectedradioval != undefined) {
                            customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[selectedradioval].price);
                        }
                    }
                }
                if (allarray[all].type == "checkbox") {
                    var custoptionid = allarray[all].option_id;
                    if (document.querySelector('input[name="options[' + custoptionid + '][]"]:checked') != null) {
                        var selectedradioval = document.querySelector('input[name="options[' + custoptionid + '][]"]:checked').value;
                        var selected = new Array();
                        jQuery(document).ready(function() {
                            jQuery('input[name="options[' + custoptionid + '][]"]:checked').each(function() {
                                selected.push(jQuery(this).val());
                            });
                        });
                        for (var i = 0; i < selected.length; i++) {
                            customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[selected[i]].price);
                        }
                    }
                }
                if (allarray[all].type == "multiple") {
                    var custoptionid = allarray[all].option_id;
                    var select1 = document.getElementById("select_" + custoptionid);
                    var selected1 = [];
                    for (var i = 0; i < select1.length; i++) {
                        if (select1.options[i].selected == true) {
                            selected1.push(select1.options[i].value);
                            customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[select1.options[i].value].price);
                        }
                    }
                }
                //field
                if (allarray[all].type == "field" || allarray[all].type == "area") {
                    var custoptionid = allarray[all].option_id;
                    if ($('options_' + custoptionid + '_text').value != '') {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
                //date
                if (allarray[all].type == "date") {
                    var custoptionid = allarray[all].option_id;
                    if ($('options_' + custoptionid + '_date').value != '') {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
                if (allarray[all].type == "date_time") {
                    var custoptionid = allarray[all].option_id;
                    if ($('options_' + custoptionid + '_date').value != '') {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
                if (allarray[all].type == "time") {
                    var custoptionid = allarray[all].option_id;
                    if (($("options_" + custoptionid + "_hour").value != "") && ($("options_" + custoptionid + "_minute").value != "")) {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
                if (allarray[all].type == "file") {
                    var custoptionid = allarray[all].option_id;
                    if ($('options_' + custoptionid + '_file').value != '' && ProductDesigner.customImage != undefined) {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
            }
            //custom optioin code add in button end
            if (ProductDesigner.prototype.data.productType == "configurable") {
                if (document.querySelector('input[name="printing_type"]:checked').getAttribute('data-code') == 'silk-screen') {
                    this.emb_alert = 0;
                    var prev_qty = qty;
                    var added_products = Array();
                    var added_products_price = Array();
                    var price_html = '';
                    var tier_price_details = ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['product_details'];
                    if (ProductDesigner.prototype.data.used_colors != "undefined") {
                        var used_colors_count = ProductDesigner.prototype.data.used_colors.length;
                        if (used_colors_count > ProductDesigner.prototype.data.area.color_count) {
                            used_colors_count = ProductDesigner.prototype.data.area.color_count;
                        }
                    }
                    for (var tierprice in tier_price_details) {
                        if (tier_price_details[tierprice]['color_counter'] == used_colors_count) {
                            jQuery('#added_products_price').val(tier_price_details[tierprice]['fixed_product_price']);
                        }
                    }
                    if (qty != 0) {
                        added_products_price = jQuery('#added_products_price').val();
                        jQuery('#item_count_value').html(qty);
                        jQuery('#item_cost_value').innerHTML = OptionsPrice.formatPrice(added_products_price);
                        // var tierflag = 0;
                        // var tierqty = 1;
                        // for (var key in ProductDesigner.tier) {
                        //     if (parseInt(ProductDesigner.tier[key].price_qty) <= qty && parseInt(tierqty) < parseInt(ProductDesigner.tier[key].price_qty)) {
                        //         tierqty = ProductDesigner.tier[key].price_qty;
                        //         tierpriceInclTax = parseFloat(ProductDesigner.tier[key].price);
                        //         tierflag = 1;
                        //     }
                        // }
                        // if (tierflag == 0) {
                        //     tierpriceInclTax = OptionsPrice.priceInclTax;
                        // }
                        var tierflag = 0;
                        var tierqty = 1;
                        for (var key in ProductDesigner.prototype.tier) {
                            if (parseInt(ProductDesigner.prototype.tier[key].price_qty) <= qty && parseInt(tierqty) < parseInt(ProductDesigner.prototype.tier[key].price_qty)) {
                                tierqty = ProductDesigner.prototype.tier[key].price_qty;
                                tierpriceInclTax = parseFloat(ProductDesigner.prototype.tier[key].price);
                                tierflag = 1;
                            }
                        }
                        if (tierflag == 0) {
                            tierpriceInclTax = OptionsPrice.priceInclTax;
                        }
                        var newdesignerprice = tierpriceInclTax + OptionsPrice.customPrices.fixed_price.price + OptionsPrice.customPrices.design_image_price.price + OptionsPrice.customPrices.design_text_price.price + OptionsPrice.customPrices.design_custom_image_price.price;
                        jQuery('#total_cost').html(OptionsPrice.formatPrice(added_products_price * qty + newdesignerprice * qty + customtotalprice * qty));
                    } else {
                        added_products_price = 0
                        jQuery('#item_count_value').innerHTML = qty;
                        jQuery('#item_cost_value').innerHTML = OptionsPrice.formatPrice(added_products_price);
                        jQuery('#total_cost').innerHTML = OptionsPrice.formatPrice(0);
                    }
                } else {
                    // By Color Quantity Range  calculation 
                    if (ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['printing_type'] == 1) {
                        this.emb_alert = 0;
                        var prev_qty = qty;
                        var added_products = Array();
                        var added_products_price = Array();
                        var price_html = '';
                        var tier_price_details = ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['product_details'];
                        var used_colors_count = ProductDesigner.prototype.used_colors.length;
                        if (used_colors_count > ProductDesigner.prototype.data.area.color_count) {
                            used_colors_count = ProductDesigner.prototype.data.area.color_count;
                        }
                        for (var tierprice in tier_price_details) {
                            if (tier_price_details[tierprice]['color_counter'] == used_colors_count) {
                                jQuery('added_products_price').val(tier_price_details[tierprice]['fixed_product_price']);
                            }
                        }
                        if (qty != 0) {
                            added_products_price = jQuery('added_products_price').val();
                            jQuery('item_count_value').html(qty);
                            jQuery('item_cost_value').html(OptionsPrice.formatPrice(added_products_price));
                            var tierflag = 0;
                            var tierqty = 1;
                            for (var key in ProductDesigner.prototype.tier) {
                                if (parseInt(ProductDesigner.prototype.tier[key].price_qty) <= qty && parseInt(tierqty) < parseInt(ProductDesigner.prototype.tier[key].price_qty)) {
                                    tierqty = ProductDesigner.prototype.tier[key].price_qty;
                                    tierpriceInclTax = parseFloat(ProductDesigner.prototype.tier[key].price);
                                    tierflag = 1;
                                }
                            }
                            if (tierflag == 0) {
                                tierpriceInclTax = OptionsPrice.priceInclTax;
                            }
                            var newdesignerprice = tierpriceInclTax + OptionsPrice.customPrices.fixed_price.price + OptionsPrice.customPrices.design_image_price.price + OptionsPrice.customPrices.design_text_price.price + OptionsPrice.customPrices.design_custom_image_price.price;
                            jQuery('#total_cost').html(OptionsPrice.formatPrice(newdesignerprice * qty + customtotalprice * qty));
                        } else {
                            added_products_price = 0
                            jQuery('#item_count_value').html(qty);
                            jQuery('#item_cost_value').html(OptionsPrice.formatPrice(added_products_price));
                            jQuery('#total_cost').html(OptionsPrice.formatPrice(0));
                        }
                    } else { //By Color Quantity Range
                        this.emb_alert = 0;
                        var prev_qty = qty;
                        var added_products = Array();
                        var added_products_price = Array();
                        var price_html = '';
                        var min_size_tier_price = 0;
                        var tier_price_details = ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['product_details'];
                        var total_size_price = 0;
                        var product_id_type = 'color_product_id';
                        var product_name_type = 'color_product_name';
                        var color_type = 'color';
                        var selected_printing_method = document.querySelector('input[name="printing_type"]:checked').value;
                        // var tier_price_details = this.data.product.printing_method_array[selected_printing_method]['tier_price_details'];
                        var tier_price_details = ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['product_details'];
                        for (var k = 0; k < area_size.length; k++) {
                            var str = area_size[k].split("_");
                            var added_color_type_products_name = Array();
                            /*if (!ProductDesigner.isNameNumberOnly[str[0]])
                             {*/
                            if (str[1] == 'small') {
                                for (var j = 0; j < side_count.length; j++) {
                                    if (area_by_side[str[1]] == side_count[j]) {
                                        for (var current_side in ProductDesigner.prototype.data.image_side) {
                                            if (side_count[j] == ProductDesigner.prototype.data.image_side[current_side]) {
                                                var prod_side = str[1] + '_' + str[0].toLowerCase();;
                                            }
                                        }
                                        for (var id in tier_price_details) {
                                            if (tier_price_details[prod_side] != "") added_products_price.push(tier_price_details[prod_side].product_id_by_color_price);
                                        }
                                    }
                                }
                                var added_color_type_product_name = jQuery.unique(added_color_type_products_name);
                                if (added_color_type_product_name.length > 0) price_html = price_html + '<span>' + added_color_type_product_name + ' :' + prev_qty + ' X ' + priceOptions.formatPrice(min_size_tier_price) + ' = ' + priceOptions.formatPrice(parseFloat(min_size_tier_price) * prev_qty) + '</span>';
                            }
                            if (str[1] == 'medium') {
                                for (var j = 0; j < side_count.length; j++) {
                                    if (area_by_side[str[1]] == side_count[j]) {
                                        for (var current_side in ProductDesigner.prototype.data.image_side) {
                                            if (side_count[j] == ProductDesigner.prototype.data.image_side[current_side]) {
                                                var prod_side = str[1] + '_' + str[0].toLowerCase();;
                                            }
                                        }
                                        for (var id in tier_price_details) {
                                            if (tier_price_details[prod_side] != "") added_products_price.push(tier_price_details[prod_side].product_id_by_color_price);
                                        }
                                    }
                                }
                                var added_color_type_product_name = jQuery.unique(added_color_type_products_name);
                                if (added_color_type_product_name.length > 0) price_html = price_html + '<span>' + added_color_type_product_name + ' :' + prev_qty + ' X ' + OptionsPrice.formatPrice(min_size_tier_price) + ' = ' + OptionsPrice.formatPrice(parseFloat(min_size_tier_price) * prev_qty) + '</span>';
                            }
                            if (str[1] == 'large') {
                                for (var j = 0; j < side_count.length; j++) {
                                    if (area_by_side[str[1]] == side_count[j]) {
                                        for (var current_side in ProductDesigner.prototype.data.image_side) {
                                            if (side_count[j] == ProductDesigner.prototype.data.image_side[current_side]) {
                                                var prod_side = str[1] + '_' + str[0].toLowerCase();;
                                            }
                                        }
                                        for (var id in tier_price_details) {
                                            if (tier_price_details[prod_side] != "") added_products_price.push(tier_price_details[prod_side].product_id_by_color_price);
                                        }
                                    }
                                }
                                var added_color_type_product_name = jQuery.unique(added_color_type_products_name);
                                if (added_color_type_product_name.length > 0) price_html = price_html + '<span>' + added_color_type_product_name + ' :' + prev_qty + ' X ' + OptionsPrice.formatPrice(min_size_tier_price) + ' = ' + OptionsPrice.formatPrice(parseFloat(min_size_tier_price) * prev_qty) + '</span>';
                            }
                            if (str[1] == 'extralarge') {
                                for (var j = 0; j < side_count.length; j++) {
                                    if (area_by_side[str[1]] == side_count[j]) {
                                        for (var current_side in ProductDesigner.prototype.data.image_side) {
                                            if (side_count[j] == ProductDesigner.prototype.data.image_side[current_side]) {
                                                var prod_side = str[1] + '_' + str[0].toLowerCase();;
                                            }
                                        }
                                        for (var id in tier_price_details) {
                                            if (tier_price_details[prod_side] != "") added_products_price.push(tier_price_details[prod_side].product_id_by_color_price);
                                        }
                                    }
                                }
                                var added_color_type_product_name = jQuery.unique(added_color_type_products_name);
                                if (added_color_type_product_name.length > 0) price_html = price_html + '<span>' + added_color_type_product_name + ' :' + prev_qty + ' X ' + OptionsPrice.formatPrice(min_size_tier_price) + ' = ' + OptionsPrice.formatPrice(parseFloat(min_size_tier_price) * prev_qty) + '</span>';
                            }
                            //}
                        }
                        if (prev_qty < ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['minimum_quantity']) {
                            if (product_tier_price != undefined) {
                                if (product_tier_price.length > 0) {
                                    min_product_tier_price = Math.min.apply(null, product_tier_price);
                                    price += (parseFloat(min_product_tier_price) * qty);
                                }
                            }
                        } else {
                            for (var i = 0; i < selected_qty.length; i++) {
                                var product_tier_price = Array();
                                if (product_tier_price.length > 0) {
                                    min_product_tier_price = Math.min.apply(null, product_tier_price);
                                    price += (parseFloat(min_product_tier_price) * selected_qty[i].qty);
                                }
                            }
                        }
                        price = parseFloat(price) + parseFloat(total_size_price);
                        added_products = jQuery.unique(added_products);
                        added_products_price = jQuery.unique(added_products_price);
                        var tierflag = 0;
                        var tierqty = 1;
                        for (var key in ProductDesigner.prototype.tier) {
                            if (parseInt(ProductDesigner.prototype.tier[key].price_qty) <= qty && parseInt(tierqty) < parseInt(ProductDesigner.prototype.tier[key].price_qty)) {
                                tierqty = ProductDesigner.prototype.tier[key].price_qty;
                                tierpriceInclTax = parseFloat(ProductDesigner.prototype.tier[key].price);
                                tierflag = 1;
                            }
                        }
                        if (tierflag == 0) {
                            tierpriceInclTax = OptionsPrice.priceInclTax;
                        }
                        var newdesignerprice = tierpriceInclTax + OptionsPrice.customPrices.fixed_price.price + OptionsPrice.customPrices.design_image_price.price + OptionsPrice.customPrices.design_text_price.price + OptionsPrice.customPrices.design_custom_image_price.price;
                        //Check if array length is more that 1 than addition of sum start
                        if (added_products_price.length > 1) {
                            var sum1 = 0;
                            for (var i = 0; i < added_products_price.length; i++) {
                                sum1 += parseInt(added_products_price[i]);
                            }
                            jQuery('#item_count_value').html(qty);
                            jQuery('#item_cost_value').html(OptionsPrice.formatPrice(sum1));
                            jQuery('#total_cost').html(OptionsPrice.formatPrice(sum1 * qty + newdesignerprice * qty + customtotalprice * qty));
                        } else {
                            jQuery('#item_count_value').html(qty);
                            jQuery('#item_cost_value').html(OptionsPrice.formatPrice(added_products_price));
                            jQuery('#total_cost').html(OptionsPrice.formatPrice(added_products_price * qty + newdesignerprice * qty + customtotalprice * qty));
                        }
                        //Check if array length is more that 1 than addition of sum end
                        jQuery('#added_products').val(added_products.join());
                        jQuery('#added_products_price').val(added_products_price.join());
                        if (ProductDesigner.prototype.data.productType == "configurable") {
                            jQuery('#selected_qty').val(JSON.stringify(selected_qty));
                        }
                        jQuery('#isNameNumberOnly').val(JSON.stringify(ProductDesigner.isNameNumberOnly));
                    }
                }
            } else {
                var added_products_price = 0
                var selected_printing_method = document.querySelector('input[name="printing_type"]:checked').value;
                var printing_front_surcharge = ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['front_surcharge'];
                if (OptionsPrice != undefined) {
                    OptionsPrice.addCustomPrices('fixed_price', {
                        price: fixedPrice,
                        type: 'fixed'
                    });
                    OptionsPrice.addCustomPrices('design_text_price', {
                        price: textsPrice,
                        type: 'fixed'
                    });
                    OptionsPrice.addCustomPrices('design_image_price', {
                        price: imagesPrice,
                        type: 'fixed'
                    });
                    OptionsPrice.addCustomPrices('design_custom_image_price', {
                        price: customImagesPrice,
                        type: 'fixed'
                    });
                    OptionsPrice.setDuplicateIdSuffix('-design');
                    OptionsPrice.reload();
                }
                var tierflag = 0;
                var tierqty = 1;
                for (var key in ProductDesigner.prototype.tier) {
                    if (parseInt(ProductDesigner.prototype.tier[key].price_qty) <= qty && parseInt(tierqty) < parseInt(ProductDesigner.prototype.tier[key].price_qty)) {
                        tierqty = ProductDesigner.prototype.tier[key].price_qty;
                        tierpriceInclTax = parseFloat(ProductDesigner.prototype.tier[key].price);
                        tierflag = 1;
                    }
                }
                if (tierflag == 0) {
                    tierpriceInclTax = OptionsPrice.priceInclTax;
                }
                var newdesignerprice = tierpriceInclTax + OptionsPrice.customPrices.fixed_price.price + OptionsPrice.customPrices.design_image_price.price + OptionsPrice.customPrices.design_text_price.price + OptionsPrice.customPrices.design_custom_image_price.price;
                added_products_price = parseFloat(printing_front_surcharge);
                jQuery('#item_count_value').innerHTML = qty;
                jQuery('#item_cost_value').innerHTML = OptionsPrice.formatPrice(added_products_price);
                jQuery('#total_cost').html(OptionsPrice.formatPrice(added_products_price * qty + newdesignerprice * qty + customtotalprice * qty));
            }
        } else {
            var price = 0;
            var product_id = ProductDesigner.prototype.data.productId;
            //custom optioin code add in button start
            var allarray = this.data.product.allcustom_option;
            for (var all in allarray) {
                var custoptionid = allarray[all].option_id;
                if (allarray[all].type == "drop_down") {
                    var custoptionid = allarray[all].option_id;
                    if (($j("#select_" + custoptionid)[0].value != "")) {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[$j("#select_" + custoptionid)[0].value].price);
                    }
                }
                if (allarray[all].type == "radio") {
                    var custoptionid = allarray[all].option_id;
                    if (document.querySelector('input[name="options[' + custoptionid + ']"]:checked') != null) {
                        var selectedradioval = document.querySelector('input[name="options[' + custoptionid + ']"]:checked').value;
                        if (selectedradioval != '' || selectedradioval != undefined) {
                            customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[selectedradioval].price);
                        }
                    }
                }
                if (allarray[all].type == "checkbox") {
                    var custoptionid = allarray[all].option_id;
                    if (document.querySelector('input[name="options[' + custoptionid + '][]"]:checked') != null) {
                        var selectedradioval = document.querySelector('input[name="options[' + custoptionid + '][]"]:checked').value;
                        var selected = new Array();
                        jQuery(document).ready(function() {
                            jQuery('input[name="options[' + custoptionid + '][]"]:checked').each(function() {
                                selected.push(jQuery(this).val());
                            });
                        });
                        for (var i = 0; i < selected.length; i++) {
                            customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[selected[i]].price);
                        }
                    }
                }
                if (allarray[all].type == "multiple") {
                    var custoptionid = allarray[all].option_id;
                    var select1 = document.getElementById("select_" + custoptionid);
                    var selected1 = [];
                    for (var i = 0; i < select1.length; i++) {
                        if (select1.options[i].selected == true) {
                            selected1.push(select1.options[i].value);
                            customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[select1.options[i].value].price);
                        }
                    }
                }
                //field
                if (allarray[all].type == "field" || allarray[all].type == "area") {
                    var custoptionid = allarray[all].option_id;
                    if ($('options_' + custoptionid + '_text').value != '') {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
                //date
                if (allarray[all].type == "date") {
                    var custoptionid = allarray[all].option_id;
                    if ($('options_' + custoptionid + '_date').value != '') {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
                if (allarray[all].type == "date_time") {
                    var custoptionid = allarray[all].option_id;
                    if ($('options_' + custoptionid + '_date').value != '') {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
                if (allarray[all].type == "time") {
                    var custoptionid = allarray[all].option_id;
                    if (($("options_" + custoptionid + "_hour").value != "") && ($("options_" + custoptionid + "_minute").value != "")) {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
                if (allarray[all].type == "file") {
                    var custoptionid = allarray[all].option_id;
                    if ($('options_' + custoptionid + '_file').value != '' && ProductDesigner.customImage != undefined) {
                        customtotalprice = customtotalprice + parseInt(this.data.product.allcustom_option[custoptionid].values[0].price);
                    }
                }
            }
            //custom optioin code add in button end
            if (ProductDesigner.prototype.data.productType == "configurable") {
                this.emb_alert = 0;
                var prev_qty = qty;
                var added_products = Array();
                var added_products_price = Array();
                var price_html = '';
                // var tier_price_details = ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['product_details'];
                if (ProductDesigner.prototype.used_colors != undefined) {
                    var used_colors_count = ProductDesigner.prototype.used_colors.length;
                    if (used_colors_count > ProductDesigner.prototype.data.area.color_count) {
                        used_colors_count = ProductDesigner.prototype.data.area.color_count;
                    }
                }
                /*for (var tierprice in tier_price_details) {
                 if (tier_price_details[tierprice]['color_counter'] == used_colors_count) {
                 jQuery('#added_products_price').val(tier_price_details[tierprice]['fixed_product_price']);
                 }
                 }*/
                if (qty != 0) {
                    var added_products_price = 0
                    if (OptionsPrice != undefined) {
                        OptionsPrice.addCustomPrices('fixed_price', {
                            price: fixedPrice,
                            type: 'fixed'
                        });
                        OptionsPrice.addCustomPrices('design_text_price', {
                            price: textsPrice,
                            type: 'fixed'
                        });
                        OptionsPrice.addCustomPrices('design_image_price', {
                            price: imagesPrice,
                            type: 'fixed'
                        });
                        OptionsPrice.addCustomPrices('design_custom_image_price', {
                            price: customImagesPrice,
                            type: 'fixed'
                        });
                        OptionsPrice.setDuplicateIdSuffix('-design');
                        OptionsPrice.reload();
                    }
                    added_products_price = jQuery('#added_products_price').val();
                    jQuery('#item_count_value').html(qty);
                    jQuery('#item_cost_value').html(OptionsPrice.formatPrice(added_products_price));
                    jQuery('#total_cost').html(OptionsPrice.formatPrice(added_products_price * qty + newdesignerprice * qty + customtotalprice * qty));
                    var tierflag = 0;
                    var tierqty = 1;
                    for (var key in ProductDesigner.prototype.tier) {
                        if (parseInt(ProductDesigner.prototype.tier[key].price_qty) <= qty && parseInt(tierqty) < parseInt(ProductDesigner.prototype.tier[key].price_qty)) {
                            tierqty = ProductDesigner.prototype.tier[key].price_qty;
                            tierpriceInclTax = parseFloat(ProductDesigner.prototype.tier[key].price);
                            tierflag = 1;
                        }
                    }
                    if (tierflag == 0) {
                        tierpriceInclTax = OptionsPrice.priceInclTax;
                    }
                    var newdesignerprice = tierpriceInclTax + OptionsPrice.customPrices.fixed_price.price + OptionsPrice.customPrices.design_image_price.price + OptionsPrice.customPrices.design_text_price.price + OptionsPrice.customPrices.design_custom_image_price.price;
                    jQuery('#total_cost').html(OptionsPrice.formatPrice(added_products_price * qty + newdesignerprice * qty + customtotalprice * qty));
                    jQuery('#item_count_value').innerHTML = qty;
                } else {
                    added_products_price = 0
                    jQuery('#item_count_value').innerHTML = qty;
                    jQuery('#item_cost_value').innerHTML = OptionsPrice.formatPrice(added_products_price);
                    jQuery('#total_cost').innerHTML = OptionsPrice.formatPrice(0);
                }
            } else {
                var added_products_price = 0
                if (OptionsPrice != undefined) {
                    OptionsPrice.addCustomPrices('fixed_price', {
                        price: fixedPrice,
                        type: 'fixed'
                    });
                    OptionsPrice.addCustomPrices('design_text_price', {
                        price: textsPrice,
                        type: 'fixed'
                    });
                    OptionsPrice.addCustomPrices('design_image_price', {
                        price: imagesPrice,
                        type: 'fixed'
                    });
                    OptionsPrice.addCustomPrices('design_custom_image_price', {
                        price: customImagesPrice,
                        type: 'fixed'
                    });
                    OptionsPrice.setDuplicateIdSuffix('-design');
                    OptionsPrice.reload();
                }
                var tierflag = 0;
                var tierqty = 1;
                for (var key in ProductDesigner.prototype.tier) {
                    if (parseInt(ProductDesigner.prototype.tier[key].price_qty) <= qty && parseInt(tierqty) < parseInt(ProductDesigner.prototype.tier[key].price_qty)) {
                        tierqty = ProductDesigner.prototype.tier[key].price_qty;
                        tierpriceInclTax = parseFloat(ProductDesigner.prototype.tier[key].price);
                        tierflag = 1;
                    }
                }
                if (tierflag == 0) {
                    tierpriceInclTax = OptionsPrice.priceInclTax;
                }
                var newdesignerprice = tierpriceInclTax + OptionsPrice.customPrices.fixed_price.price + OptionsPrice.customPrices.design_image_price.price + OptionsPrice.customPrices.design_text_price.price + OptionsPrice.customPrices.design_custom_image_price.price;
                // added_products_price = parseFloat(printing_front_surcharge);
                jQuery('#item_count_value').innerHTML = qty;
                // jQuery('#item_cost_value').innerHTML = OptionsPrice.formatPrice(added_products_price);
                jQuery('#total_cost').html(OptionsPrice.formatPrice(newdesignerprice * qty + customtotalprice * qty));
            }
        }
        if (final_qty != qty) {
            var price_per_item = price / qty;
            price = price_per_item * final_qty;
            qty = final_qty;
        }
        var formattedPrice = OptionsPrice.formatPrice(price);
    },
    saveDesign: function(url, responseFunction) {
        if ((this.canvas == null) || this.canvas == 'undefined') {
            return;
        }
        var params = this.prepareImagesForSave();
        jQuery('#pd_loading_img').show();
        jQuery.ajax({
            url: url,
            method: 'post',
            data: {
                data: params
            },
            success: function(data, textStatus, jqXHR) {
                jQuery('#pd_loading_img').hide();
                responseFunction(data);
            }
        });
    },
    continueFunction: function(transport) {
        var response = JSON.parse(transport);
        var login_data = {};
        login_data['productid'] = response.productid;
        login_data['design'] = response.design_id;
        ProductDesigner.prototype.designIdSave = response.design_id;
        if (response.status == 'redirect' && response.url != undefined) {
            if (jQuery('#customOptionFormProdSettings').valid()) {
                jQuery('#pd_loading_img').css("z-index", "999");
                jQuery('#pd_loading_img').show();
                jQuery("#cart-add").attr('disabled', 'disabled');
                login_data['qty'] = jQuery("#qty").val();
                login_data['producttype'] = ProductDesigner.prototype.data.productType;
                login_data['colorid'] = jQuery("#color").val();
                login_data['color'] = ProductDesigner.prototype.currentProductColor;
                login_data['custom'] = jQuery("#custom-option *").serializeArray();
                login_data['configattr'] = jQuery("#size-chart *").serializeArray();
                if (ProductDesigner.prototype.data.printing_method_avail != '0') {
                    login_data['printing_code'] = document.querySelector('input[name="printing_type"]:checked').getAttribute('data-code');
                    login_data['printing_type_id'] = document.querySelector('input[name="printing_type"]:checked').getAttribute('value');
                    if (ProductDesigner.prototype.data.productType != "configurable") {
                        login_data['printing_surcharge'] = ProductDesigner.prototype.data.product.printing_method_array[login_data['printing_type_id']]['front_surcharge'];
                    } else {
                        var price = 0;
                        var product_id = ProductDesigner.prototype.data.productId;
                        var selected_printing_method = document.querySelector('input[name="printing_type"]:checked').value;
                        var added_products_price = 0;
                        if (ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['printing_type'] == 1) {
                            var tier_price_details = ProductDesigner.prototype.data.product.printing_method_array[selected_printing_method]['product_details'];
                            var used_colors_count = ProductDesigner.prototype.used_colors.length;
                            if (used_colors_count > ProductDesigner.prototype.data.area.color_count) {
                                used_colors_count = ProductDesigner.prototype.data.area.color_count;
                            }
                            for (var tierprice in tier_price_details) {
                                if (tier_price_details[tierprice]['color_counter'] == used_colors_count) {
                                    added_products_price = tier_price_details[tierprice]['fixed_product_price'];
                                }
                            }
                        } else {
                            added_products = jQuery('#added_products').val();
                            var added_products_price = jQuery('#added_products_price').val();
                            fixed_products = 0;
                        }
                    }
                    // printing method simple product start
                    if (added_products_price != '') {
                        output = added_products_price.split(",");
                        var dataSum = 0;
                        for (var i = 0; i < output.length; i++) {
                            dataSum += parseFloat(output[i].toString().match(/(\d+)/));
                        }
                    } else {
                        var dataSum = 0;
                    }
                    login_data['printing_surcharge'] = dataSum;
                }
                login_data['used_color_count'] = ProductDesigner.prototype.used_colors.length;
                login_data['area_size_id'] = ProductDesigner.prototype.area_size_id;
                jQuery.ajax({
                    url: ProductDesigner.prototype.addtocarturl,
                    method: 'post',
                    data: {
                        data: login_data
                    },
                    success: function(data, textStatus, jqXHR) {
                        jQuery('#pd_loading_img').hide();
                        var response = JSON.parse(data);
                        if (response.status == 'success') {
                            //  jQuery('#add-to-cart').modal('closeModal');
                            window.onbeforeunload = null;
                            window.top.location.href = response.url;
                        } else if (response.status == 'fail') {
                            jQuery("#cart-add").removeAttr('disabled');
                            jQuery('#cart-error-msg').html('');
                            jQuery('#cart-error-msg').html(response.message);
                        }
                    }
                });
            }
        } else if (response.status == 'fail') {
            console.log(response.message);
        }
    },
    saveDesignFunction: function(transport) {
        var response = JSON.parse(transport);
        if (response.status == 'success') {
            ProductDesigner.prototype.designIdSave = response.design_id;
            // get customer designs
            if (response.designs) {
                if (jQuery('#mydesigns_images_container') != undefined) jQuery('#mydesigns_images_container').html(response.designs);
            }
            // get customer designs
            ProductDesigner.prototype.designChanged[ProductDesigner.prototype.currentProductColor] = false;
            ProductDesigner.prototype.designId[ProductDesigner.prototype.currentProductColor] = response.design_id;
            ProductDesigner.prototype._observeNavButtons('disabled');
            ProductDesigner.prototype._observeControlButtons();
            alert('Design was saved successfully.');
            ProductDesigner.prototype.fbUrl = response.fbshare;
            ProductDesigner.prototype.twUrl = response.twshare;
            ProductDesigner.prototype.gUrl = response.gshare;
            ProductDesigner.prototype.piUrl = response.pinshare;
            window.onbeforeunload = null;
        } else if (response.status == 'fail') {
            console.log(response.message);
        }
    },
    observeShareButtons: function() {
        jQuery('#fb_share').on('click', function(e) {
            ProductDesigner.prototype.clickedSocialButton = 'fb_share';
            this.observeSaveAndShareButton(jQuery('#fb_share'));
        }.bind(this));
        jQuery('#tw_share').on('click', function(e) {
            ProductDesigner.prototype.clickedSocialButton = 'tw_share';
            this.observeSaveAndShareButton(jQuery('#tw_share'));
        }.bind(this));
        jQuery('#g_share').on('click', function(e) {
            ProductDesigner.prototype.clickedSocialButton = 'g_share';
            this.observeSaveAndShareButton(jQuery('#g_share'));
        }.bind(this));
        jQuery('#pin_share').on('click', function(e) {
            ProductDesigner.prototype.clickedSocialButton = 'pin_share';
            this.observeSaveAndShareButton(jQuery('#pin_share'));
        }.bind(this));
        jQuery('#email_share').on('click', function(e) {
            ProductDesigner.prototype.clickedSocialButton = 'email_share';
            this.observeSaveAndShareButton(jQuery('#email_share'));
        }.bind(this));
    },
    observeSaveAndShareButton: function(ele) {
        if (!this.canvasesHasDesigns()) {
            alert('Please design product');
            return;
        }
        if (this.isCustomerLogin == '0') {
            this.createLoginPreviewWindow();
        } else if (this.isCustomerLogin == '1') {
            if (ProductDesigner.prototype.shareImage == 0) this.saveDesignAndRedirect(this.saveDesignUrl, ele);
            else {
                if (ele[0].id == 'fb_share') {
                    //window.open(ProductDesigner.prototype.fbUrl);
                    facebook_share(ProductDesigner.prototype.data.productId, ProductDesigner.prototype.designIdSave);
                } else if (ele[0].id == 'tw_share') {
                    window.open(ProductDesigner.prototype.twUrl);
                } else if (ele[0].id == 'g_share') {
                    //window.open(ProductDesigner.prototype.gUrl);
                    google_share(ProductDesigner.prototype.data.productId, ProductDesigner.prototype.designIdSave);
                } else if (ele[0].id == 'pin_share') {
                    window.open(ProductDesigner.prototype.piUrl);
                } else if (ele[0].id == 'email_share') {
                    require(['jquery', 'Magento_Ui/js/modal/modal'], function($, modal) {
                        var options = {
                            type: 'popup',
                            responsive: true,
                            innerScroll: true,
                            modalClass: 'email-share-window',
                            title: 'Send to Friend',
                            buttons: []
                        };
                        var popup = modal(options, $('#email-share-window'));
                        $('#email-share-window').modal('openModal');
                    });
                    return;
                }
            }
        }
    },
    saveDesignAndRedirect: function(url, ele) {
        if ((this.canvas == null) || this.canvas == 'undefined') {
            return;
        }
        var params = this.prepareImagesForSave();
        jQuery('#pd_loading_img').show();
        jQuery.ajax({
            url: url,
            method: 'post',
            data: {
                data: params
            },
            success: function(data, textStatus, jqXHR) {
                var response = JSON.parse(data);
                jQuery('#pd_loading_img').hide();
                if (response.status == 'success') {
                    ProductDesigner.prototype.designIdSave = response.design_id;
                    ProductDesigner.prototype.designChanged[ProductDesigner.prototype.currentProductColor] = false;
                    ProductDesigner.prototype.designId[ProductDesigner.prototype.currentProductColor] = response.design_id;
                    ProductDesigner.prototype._observeNavButtons('disabled');
                    ProductDesigner.prototype._observeControlButtons();
                    alert('Design was saved successfully.');
                    ProductDesigner.prototype.fbUrl = response.fbshare;
                    ProductDesigner.prototype.twUrl = response.twshare;
                    ProductDesigner.prototype.gUrl = response.gshare;
                    ProductDesigner.prototype.piUrl = response.pinshare;
                    if (ele[0].id == 'fb_share') {
                        facebook_share(ProductDesigner.prototype.data.productId, ProductDesigner.prototype.designIdSave);
                        //window.open(response.fbshare);
                    } else if (ele[0].id == 'tw_share') {
                        window.open(response.twshare);
                    } else if (ele[0].id == 'g_share') {
                        //window.open(response.gshare);
                        google_share(ProductDesigner.prototype.data.productId, ProductDesigner.prototype.designIdSave);
                    } else if (ele[0].id == 'pin_share') {
                        window.open(response.pinshare);
                    } else if (ele[0].id == 'email_share') {
                        require(['jquery', 'Magento_Ui/js/modal/modal'], function($, modal) {
                            var options = {
                                type: 'popup',
                                responsive: true,
                                innerScroll: true,
                                modalClass: 'email-share-window',
                                title: 'Send to Friend',
                                buttons: []
                            };
                            var popup = modal(options, $('#email-share-window'));
                            $('#email-share-window').modal('openModal');
                        });
                        return;
                    }
                } else if (response.status == 'fail') {
                    console.log(response.message);
                }
            }
        });
    },
    reStuctureImagesObject: function(img_obj) {
        this.newreStuctureImagesObject = [];
        var images_obj = img_obj[this.currentProductColor];
        for (var prop in images_obj) {
            if (images_obj[prop].dim.length == undefined) {
                this.newreStuctureImagesObject['@' + images_obj[prop].image_id + '&' + images_obj[prop].designArea_id] = images_obj[prop];
            } else {
                for (var i = 0; i < images_obj[prop].dim.length; i++) {
                    this.newreStuctureImagesObject['@' + images_obj[prop].image_id + '&' + images_obj[prop].dim[i].design_area_id] = images_obj[prop];
                }
            }
        }
        return this.newreStuctureImagesObject;
    },
    observeDownloadButton: function() {
        if (jQuery('#download_btn')[0].getAttribute('download') == null) {
            jQuery('#download_btn').on('click', function(e) {
                var element = e.target || e.srcElement;
                //e.stop();
                if (!this.canvasesHasDesigns()) {
                    alert('Please design product');
                    return;
                }
                this.downloadFunction(this.downloadUrl, element);
            }.bind(this));
        }
    },
    observeMailShareButton: function() {
        jQuery('#save_receipen_mail').on('click', function(e) {
            jQuery('#pd_loading_img').show();
            var friendMail = jQuery('#receipent_email').val();
            var data = {};
            data.mail = friendMail;
            data.design_id = ProductDesigner.prototype.designIdSave;
            data.product_id = this.data.productId;
            jQuery.ajax({
                url: ProductDesigner.prototype.sendmailUrl,
                method: 'post',
                data: {
                    data: data
                },
                success: function(data, textStatus, jqXHR) {
                    var response = JSON.parse(data);
                    if (response.status == 'success') {
                        jQuery('#email-share-window').modal('closeModal');
                        jQuery('#pd_loading_img').hide();
                        alert('Mail has been sent');
                    }
                }
            });
        }.bind(this));
    },
    downloadFunction: function(url, element) {
        if ((this.canvas == null) || this.canvas == 'undefined') {
            return;
        }
        var params = this.prepareImagesForSave();
        jQuery('#pd_loading_img').show();
        jQuery.ajax({
            url: url,
            method: 'post',
            data: {
                data: params
            },
            success: function(data, textStatus, jqXHR) {
                var response = JSON.parse(data);
                var download_url = response['url'];
                //window.open(download_url);
                var downloadButtonFile = jQuery('#download_btn_file').attr('href', download_url).attr('download', 'design.jpg');
                //$('a[target="_blank"]').removeAttr('target');
                downloadButtonFile[0].click();
                jQuery('#pd_loading_img').hide();
            }
        });
    },
    canvasesHasDesigns: function() {
        var count = 0;
        //var colorImages = this.data.product.images[this.currentProductColor];
        var colorImages = this.reStuctureImagesObject(this.data.product.images);
        for (var imageId in ProductDesigner.prototype.containerCanvases) {
            if (colorImages.hasOwnProperty(imageId)) {
                var canvasCount = this.canvasHasDesignes(imageId);
                if (canvasCount) {
                    count += canvasCount;
                }
            }
        }
        return count > 0 ? true : false;
        //return 1;
    },
    canvasHasDesignes: function(id) {
        var canvas = ProductDesigner.prototype.containerCanvases[id];
        if (canvas && canvas != 'undefined') {
            return canvas.getObjects().length;
        }
        return false;
    },
    prepareImagesForSave: function() {
        if (this.zoomCount > 0) {
            while (this.zoomCount != 0) {
                var img = this.data.product.images[this.currentProductColor][this.currentProduct];
                this.resizeCanvas(img, this.currentProduct, 'out');
            }
        } else if (this.zoomCount < 0) {
            while (this.zoomCount != 0) {
                var img = this.data.product.images[this.currentProductColor][this.currentProduct];
                this.resizeCanvas(img, this.currentProduct, 'in');
            }
        }
        var data = {};
        if ((this.canvas == null) || this.canvas == 'undefined') {
            return data;
        }
        var colorImages = this.reStuctureImagesObject(this.data.product.images);
        var images = {};
        var large_images = {};
        var layers = {};
        var parentImageId = {};
        var masking_data = {};
        var isSVGCanvas = {};
        for (var imageId in ProductDesigner.prototype.containerCanvases) {
            if (ProductDesigner.prototype.containerCanvases.hasOwnProperty(imageId) && colorImages.hasOwnProperty(imageId)) {
                if (ProductDesigner.prototype.containerCanvases[imageId]['masking_data'] != null) {
                    masking_data[imageId] = ProductDesigner.prototype.containerCanvases[imageId]['masking_data'];
                }
                var canvas = ProductDesigner.prototype.containerCanvases[imageId];
                if (canvas.getObjects().length > 0) {
                    canvas.deactivateAll();
                    canvas.renderAll();
                    var colorImages_new = this.reStuctureImagesObject(this.data.product.images);
                    var orig_width = colorImages_new[imageId].orig_width;
                    var mult = orig_width / ProductDesigner.prototype.productImageSize.width;
                    var large_image = canvas.toDataURLWithMultiplier('png', mult, 1);
                    large_image = large_image.substr(large_image.indexOf(',') + 1).toString();
                    if (ProductDesigner.prototype.data.isSVG == 0) {
                        var image = canvas.toDataURLWithMultiplier('png', this.scaleFactor);
                        isSVGCanvas[imageId] = false;
                    } else {
                        isSVGCanvas[imageId] = true;
                        var allObj = canvas.getObjects();
                        for (var i = 0; i < allObj.length; i++) {
                            if ((allObj[i].type == 'image') || (allObj[i].type == 'text')) {
                                isSVGCanvas[imageId] = false;
                                break;
                            }
                        }
                        if (isSVGCanvas[imageId] == true) {
                            var image = this.fixSVGText(canvas.toSVG());
                        } else {
                            var image = canvas.toDataURLWithMultiplier('png', this.scaleFactor);
                        }
                    }
                    var arcArray = {};
                    for (var key in LayersManager.prototype.layers) {
                        var layer_data = Array();
                        var layer_details = {};
                        var img_obj = LayersManager.prototype.layers[key];
                        for (var tempObj in canvas.getObjects()) {
                            if (img_obj != null) {
                                if (canvas.getObjects()[tempObj].obj_id == img_obj.obj_id) {
                                    if (!img_obj.arcOn) {
                                        if (img_obj && img_obj != null && img_obj.selectedColor == this.currentProductColor) {
                                            var layer = img_obj.toDataURL();
                                            layer_details.product_id = this.data.productId ? this.data.productId : '';
                                            layer_details.top = img_obj.top;
                                            layer_details.left = img_obj.left;
                                            layer_details.objFilters = img_obj.filters;
                                            layer_details.obj_used_colors_obj = img_obj.obj_used_colors_obj;
                                            layer_details.height = img_obj.height;
                                            layer_details.width = img_obj.width;
                                            layer_details.scalex = img_obj.scaleX;
                                            layer_details.scaley = img_obj.scaleY;
                                            layer_details.angle = img_obj.angle;
                                            layer_details.tab = img_obj.tab;
                                            layer_details.name = img_obj.name;
                                            layer_details.type = img_obj.type;
                                            layer_details.text = img_obj.text;
                                            layer_details.textarea = img_obj.textarea;
                                            layer_details.price = img_obj.price;
                                            for (var tempObj in canvas.getObjects()) {
                                                if (canvas.getObjects()[tempObj].obj_id == img_obj.obj_id) {
                                                    layer_details.zIndex = canvas.getObjects().indexOf(img_obj);
                                                }
                                            }
                                            layer_details.wInnerWidth = window.innerWidth;
                                            layer_details.group_type = img_obj.group_type;
                                            layer_details.zIndex = canvas.getObjects().indexOf(img_obj);
                                            layer_details.oldFontSize = img_obj.oldFontSize;
                                            layer_details.image_side = img_obj.image_side;
                                            layer_details.textObj = img_obj;
                                            var newObjectImageId = img_obj.image_id.replace("@", "");
                                            layer_details.designarea_id = img_obj.designarea_id;
                                            layer_details.image_id = newObjectImageId;
                                            layer_details.image_data = layer.substr(layer.indexOf(',') + 1).toString();
                                            if (img_obj.name == 'brush') {
                                                layer_details.brush_path = img_obj.path;
                                            }
                                            if (img_obj.type == 'image') {
                                                layer_details.image_url = img_obj._originalElement.src;
                                            } else if ((img_obj.type == 'path-group') || (img_obj.type == 'path')) {
                                                layer_details.image_url = img_obj.src;
                                            } else {
                                                var scaleX = img_obj.scaleX;
                                                var scaleY = img_obj.scaleY;
                                                var padding = img_obj.padding;
                                                var tempScaleX = scaleX * this.scaleFactor;
                                                var tempScaleY = scaleY * this.scaleFactor;
                                                img_obj.scaleX = tempScaleX;
                                                img_obj.scaleY = tempScaleY;
                                                img_obj.setCoords();
                                                var height = img_obj.getHeight();
                                                var width = img_obj.getWidth();
                                                img_obj.set({
                                                    height: ProductDesigner.prototype.imageSize.height,
                                                    width: ProductDesigner.prototype.imageSize.width,
                                                    padding: Math.round(100 * this.scaleFactor)
                                                })
                                                img_obj.setCoords();
                                                canvas.renderAll();
                                                var layer = img_obj.toDataURL();
                                                img_obj.set({
                                                    height: height,
                                                    width: width,
                                                    padding: padding
                                                })
                                                img_obj.setCoords();
                                                canvas.renderAll();
                                                img_obj.scaleX = scaleX;
                                                img_obj.scaleY = scaleY;
                                                img_obj.setCoords();
                                                layer_details.image_data = layer.substr(layer.indexOf(',') + 1).toString();
                                            }
                                            layer_data.push(layer_details);
                                            layers[key] = layer_data;
                                        }
                                    } else {
                                        for (var k = 0; k <= canvas.getObjects().length; k++) {
                                            var img_obj = canvas.getObjects()[k];
                                            if (img_obj && img_obj != null && img_obj.arcOn) {
                                                arcArray[img_obj.obj_id] = img_obj;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    for (var key in arcArray) {
                        var layer_data = Array();
                        var layer_details = {};
                        var img_obj = arcArray[key];
                        var layer = img_obj.toDataURL();
                        layer_details.product_id = this.data.productId ? this.data.productId : '';
                        layer_details.top = img_obj.top;
                        layer_details.left = img_obj.left;
                        layer_details.objFilters = img_obj.filters;
                        layer_details.obj_used_colors_obj = img_obj.obj_used_colors_obj;
                        layer_details.height = img_obj.height;
                        layer_details.width = img_obj.width;
                        layer_details.scalex = img_obj.scaleX;
                        layer_details.scaley = img_obj.scaleY;
                        layer_details.angle = img_obj.angle;
                        layer_details.tab = img_obj.tab;
                        layer_details.name = img_obj.name;
                        layer_details.type = img_obj.type;
                        layer_details.text = img_obj.text;
                        layer_details.price = img_obj.price;
                        layer_details.wInnerWidth = window.innerWidth;
                        layer_details.group_type = img_obj.group_type;
                        for (var tempObj in canvas.getObjects()) {
                            if (canvas.getObjects()[tempObj].obj_id == img_obj.obj_id) {
                                layer_details.zIndex = canvas.getObjects().indexOf(img_obj);
                            }
                        }
                        layer_details.oldFontSize = img_obj.oldFontSize;
                        layer_details.image_side = img_obj.image_side;
                        layer_details.textObj = img_obj;
                        var newObjectImageId = img_obj.image_id.replace("@", "");
                        layer_details.designarea_id = img_obj.designarea_id;
                        layer_details.image_id = newObjectImageId;
                        layer_details.image_data = layer.substr(layer.indexOf(',') + 1).toString();
                        layer_details.arc = img_obj.arc;
                        if (img_obj.name == 'brush') {
                            layer_details.brush_path = img_obj.path;
                        }
                        if (img_obj.type == 'image') {
                            layer_details.image_url = img_obj._originalElement.src;
                        } else if ((img_obj.type == 'path-group') || (img_obj.type == 'path')) {
                            layer_details.image_url = img_obj.src;
                        } else {
                            var layer = img_obj.toDataURL();
                            layer_details.image_data = layer.substr(layer.indexOf(',') + 1).toString();
                        }
                        layer_data.push(layer_details);
                        layers[key] = layer_data;
                    }
                    image = image.substr(image.indexOf(',') + 1).toString();
                    images[imageId] = image;
                    var parentImage = imageId.split("&")[0];
                    if (this.ImageMultipleArray['@' + this.data.product.images[this.currentProductColor][parentImage].image_id]) parentImageId[imageId] = this.data.product.images[this.currentProductColor][parentImage].dim[0].image_id;
                    else parentImageId[imageId] = this.data.product.images[this.currentProductColor][parentImage].dim.image_id;
                    large_images[imageId] = large_image;
                    var contextTop = canvas.contextTop;
                    if (contextTop && contextTop != undefined) {
                        canvas.clearContext(contextTop);
                    }
                }
            }
        }
        if (Object.keys(images).length > 0) {
            this.isGroupOrder = 0;
            var params = getUrlParams();
            data['isGroupOrder'] = '[]';
            data['id'] = params['id'];
            data['product_id'] = this.data.productId;
            data['design'] = params['design'];
            data['isSVG'] = ProductDesigner.prototype.data.isSVG;
            data['isSVGCanvas'] = isSVGCanvas;
            data['images'] = JSON.stringify(images);
            data['parentImageId'] = JSON.stringify(parentImageId);
            data['has_design'] = this.canvasesHasDesigns();
            data['large_images'] = JSON.stringify(large_images);
            data['masking_images'] = JSON.stringify(masking_data);
            data['prices'] = JSON.stringify(this.designerPrices);
            data['layers'] = JSON.stringify(layers);
            data['customer_comments'] = jQuery('#customer_comments').val();
            data['image_id'] = this.currentProduct;
            var is_config = this.data.product.images[this.currentProductColor][this.currentProduct].is_configurable;
            if (is_config == 1) {
                data['selected_qty'] = jQuery('#selected_qty').val();
                if (this.currentProductColor) {
                    data['color'] = this.currentProductColor;
                }
            }
            if (this.currentProductColor) {
                data['color'] = this.currentProductColor;
            }
        }
        return data;
    },
    fixSVGText: function(str) {
        // parse our string as a DOM object and get the SVGElement
        var svg = new DOMParser().parseFromString(str, "image/svg+xml").documentElement;
        // get all <tspan> elements
        var tspans = svg.querySelectorAll('tspan');
        for (var i = 0; i < tspans.length; i++) {
            var ts = tspans[i],
                parent = ts.parentNode,
                gParent = parent.parentNode;
            var j = 0;
            // create a new SVGTextElement to replace our tspan
            var replace = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            var tsAttr = ts.attributes;
            // set the 'x', 'y' and 'fill' attributes to our new element
            for (j = 0; j < tsAttr.length; j++) {
                replace.setAttributeNS(null, tsAttr[j].name, tsAttr[j].value);
            }
            // append the contentText
            var childNodes = ts.childNodes;
            for (j = 0; j < childNodes.length; j++) {
                replace.appendChild(ts.childNodes[j]);
            }
            var tAttr = parent.attributes;
            // set the original text attributes to our new one
            for (j = 0; j < tAttr.length; j++) {
                replace.setAttributeNS(null, tAttr[j].name, tAttr[j].value);
            }
            // append our new text to the grand-parent
            gParent.appendChild(replace);
            // if this is the last tspan
            if (ts === parent.lastElementChild)
                // remove the old, now empty, SVGTextElement
                gParent.removeChild(parent)
        }
        // return a string version of our cleaned svg
        return new XMLSerializer().serializeToString(svg);
    },
    clickMaskingImage: function() {
        for (prop in this.data.product.images[this.currentProductColor]) {
            if (this.data.product.images[this.currentProductColor][prop].dim.length == undefined) {
                for (maskingcanvas in this.containerCanvases) {
                    var id = maskingcanvas.split('&');
                    if (this.data.product.images[this.currentProductColor][prop].designArea_id == id[1]) {
                        if (this.data.product.images[this.currentProductColor][prop].masking_image_path != undefined) {
                            var url = this.data.product.images[this.currentProductColor][prop].masking_image_path;
                            fabric.loadSVGFromURL(url, (function(objData) {
                                return function(objects, options) {
                                    var canvas = objData.Canvas;
                                    var url = objData.Url;
                                    var cmd = new ObjectMaskingHistory(canvas, objects, options, url, null);
                                    cmd.exec();
                                }
                            })({
                                Canvas: this.containerCanvases[maskingcanvas],
                                Url: url,
                            }));
                        }
                    }
                }
            } else {
                for (dims in this.data.product.images[this.currentProductColor][prop].dim) {
                    if (this.data.product.images[this.currentProductColor][prop].dim[dims].masking_image_path != undefined) {
                        for (maskingcanvas in this.containerCanvases) {
                            var id = maskingcanvas.split('&');
                            if (this.data.product.images[this.currentProductColor][prop].dim[dims].design_area_id == id[1]) {
                                if (this.data.product.images[this.currentProductColor][prop].dim[dims].masking_image_path != undefined) {
                                    var url = this.data.product.images[this.currentProductColor][prop].dim[dims].masking_image_path;
                                    fabric.loadSVGFromURL(url, (function(objData) {
                                        return function(objects, options) {
                                            var canvas = objData.Canvas;
                                            var url = objData.Url;
                                            var cmd = new ObjectMaskingHistory(canvas, objects, options, url, null);
                                            cmd.exec();
                                        }
                                    })({
                                        Canvas: this.containerCanvases[maskingcanvas],
                                        Url: url,
                                    }));
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    observeProductColorChange: function() {
        if (jQuery('#product-colors')) {
            jQuery('#product-colors .color-img').click(function(e, elem) {
                jQuery('.product-side-img').each(function(index, val) {
                    jQuery('.product-side-img')[index].click();
                }.bind(this));
                var color = e.currentTarget.getAttribute('data-color_id');
                if (this.currentProductColor != color) {
                    if (!jQuery(e.currentTarget).hasClass('selected')) {
                        jQuery(jQuery(e.currentTarget)).parent().siblings().find('.color-img').removeClass("selected");
                    }
                    jQuery(e.currentTarget).addClass('selected');
                    this.changeProductColor(color, ProductDesigner.prototype.ImageSideObject);
                    //$('product-sides').children[1].children[0].children[0].click();
                    this.product_default_color = e.currentTarget.getAttribute('data-color_id');
                    var obj = this.canvas.getObjects();
                    for (var i = 0; i < obj.length; i++) {
                        ProductDesigner.prototype.currentImageSide = obj[i].image_side;
                    }
                    this._observeNavButtons('disabled');
                    this.canvas.renderAll();
                    this.zoomCount = 0;
                    jQuery('#zoom_count').children().html(ProductDesigner.prototype.zoomCount);
                    jQuery('#zoom_out').parent().removeAttr('disabled');
                    jQuery('#zoom_out').parent().removeClass('disabled');
                    jQuery('#zoom_in').parent().removeAttr('disabled');
                    jQuery('#zoom_in').parent().removeClass('disabled');
                    //this.reloadPrice();
                    jQuery('.product-side-img').each(function(index, val) {
                        if (index != 0) jQuery('.product-side-img')[index].click();
                    }.bind(this));
                    if (jQuery('#product-sides')[0].children[1].children[0] != undefined) {
                        jQuery('#product-sides')[0].children[1].children[0].children[0].click();
                    }
                }
                this.reloadTierPrice(color);
            }.bind(this));
        }
    },
    changeProductColor: function(color, last_object) {
        var old_canvas = last_object;
        ProductDesigner.prototype.containerCanvases[ProductDesigner.prototype.currentDesignArea] = ProductDesigner.prototype.canvas;
        var lenght1 = parseInt(ProductDesigner.prototype.product_container.childElementCount);
        for (var i = 0; i < lenght1; i++) {
            var newSide = ProductDesigner.prototype.product_container.firstElementChild;
            ProductDesigner.prototype.product_container_layers[ProductDesigner.prototype.product_container.children[0].getAttribute('selection_area')] = newSide;
            ProductDesigner.prototype.product_container.removeChild(ProductDesigner.prototype.product_container.firstElementChild);
            // ProductDesigner.prototype.product_container.removeChild(ProductDesigner.prototype.product_container.firstElementChild);
            //ProductDesigner.prototype.product_container.firstElementChild.remove();  
            //ProductDesigner.prototype.product_container_layers[ProductDesigner.prototype.currentProduct] = ProductDesigner.prototype.product_container.firstElementChild.remove();
            //ProductDesigner.prototype.product_container.firstElementChild;
        }
        //ProductDesigner.prototype.product_container_layers[ProductDesigner.prototype.currentDesignArea] = ProductDesigner.prototype.product_container.childNodes[0];
        var product = this.data.product;
        this.initProduct(product, color);
        this.updateProductImages(product);
        this._cloneCanvas(old_canvas);
        this.reloadPrice();
        this.reloadPrintingPrice();
        this._observeControlButtons();
    },
    updateProductImages: function(product) {
        if (!jQuery(this.opt.product_side_id)) {
            return;
        }
        var productsList = jQuery('#' + this.opt.product_side_id).children('ul');
        jQuery(productsList).html('');
        var images = product.images[this.currentProductColor];
        var imageTemplateData = {};
        var imagesHtml = '';
        var a = '';
        var image = new Array();
        for (var id in images) {
            if (images.hasOwnProperty(id)) {
                var flag = 1;
                for (var j = 0; j < image.length; j++) {
                    if (images[id].image_side == image[j]) flag = 0;
                }
                if (flag == 0) {} else {
                    imageTemplateData['url'] = images[id].url;
                    imageTemplateData['data-image_id'] = id;
                    a = a + "<li><img width='50' height='50' class='product-side-img' src='" + imageTemplateData['url'] + "' data-image_id='" + imageTemplateData['data-image_id'] + "'></li>";
                    image.push(images[id].image_side);
                }
            }
        }
        jQuery(productsList).html(a);
        jQuery('.product-side-img').addClass('selected');
    },
    observeProductSideImageChange: function() {
        jQuery('#product-sides').on("click", 'ul li .product-side-img', function(e, elem) {
            var old_canvas = ProductDesigner.prototype.ImageSideObject;
            this.changeProductImage(e.currentTarget.getAttribute('data-image_id'), old_canvas);
            jQuery('.product-side-img').each(function(index, val) {
                jQuery(jQuery(val).parent()[0]).removeClass('selected');
            });
            jQuery(jQuery(this).parent()[0]).addClass('selected');
            var img = this.data.product.images[this.currentProductColor][e.currentTarget.getAttribute('data-image_id')];
            this.resizeCanvas(img, e.currentTarget.getAttribute('data-image_id'));
            this.zoomCount = 0;
            jQuery('zoom_count').children().html(this.zoomCount);
            jQuery('zoom_out').parent().removeAttr('disabled');
            jQuery('zoom_out').parent().removeClass('disabled');
            jQuery('zoom_in').parent().removeAttr('disabled');
            jQuery('zoom_in').parent().removeClass('disabled');
        }.bind(this));
    },
    observeCloseTab: function() {
        jQuery('#close_tabs').on('click', function(e) {
            jQuery('#resp-tabs-container').hide();
            jQuery('#res-overlay').hide();
            jQuery('.resp-tab-item').each(function(index, val) {
                jQuery(val).removeClass('resp-tab-active');
            });
            jQuery('#rs-left-panel').removeClass('left-panel-active');
        }.bind(this));
    },
    changeProductImage: function(id, old_canvas) {
        var img = this.data.product.images[this.currentProductColor][id];
        ProductDesigner.prototype.currentImageSide = img.image_side;
        /*change for multiple*/
        /*if(img && this.currentProduct != img.image_id) {
         this.containerCanvases[this.currentProduct] = this.canvas;                          this.product_container_layers[this.currentProduct] = this.product_container.childElements()[0].remove();
         this.setDesignArea(img);
         this._cloneCanvas(old_canvas);
         this._observeControlButtons();
         }*/
        if (img && this.currentProduct != img.image_id) {
            ProductDesigner.prototype.containerCanvases[ProductDesigner.prototype.currentDesignArea] = ProductDesigner.prototype.canvas;
            var lenght1 = parseInt(ProductDesigner.prototype.product_container.childNodes.length);
            for (var i = 0; i < lenght1; i++) {
                /*ProductDesigner.prototype.product_container_layers[ProductDesigner.prototype.product_container.children[0].getAttribute('selection_area')] = ProductDesigner.prototype.product_container.children[0];
                 ProductDesigner.prototype.product_container.children[0].remove();*/
                /*ProductDesigner.prototype.product_container_layers[ProductDesigner.prototype.currentDesignArea] = jQuery(jQuery(ProductDesigner.prototype.product_container.firstElementChild)[0].remove())[0];*/
                var newSide = ProductDesigner.prototype.product_container.firstElementChild;
                ProductDesigner.prototype.product_container_layers[ProductDesigner.prototype.product_container.children[0].getAttribute('selection_area')] = newSide;
                //ProductDesigner.prototype.product_container.firstElementChild.remove();                       
                ProductDesigner.prototype.product_container.removeChild(ProductDesigner.prototype.product_container.firstElementChild);
            }
            this.setDesignArea(img);
            this._cloneCanvas(old_canvas);
            this._observeControlButtons();
        }
    },
    _cloneCanvas: function(old_canvas) {
        this.productDesigner = ProductDesigner.prototype;
        for (prop in old_canvas) {
            var prop2 = prop.split("_");
            if (ProductDesigner.prototype.currentImageSide == prop2[0]) {
                var prop3 = prop2[3].split('&');
                LayersManager.prototype.removeOutsideMark(old_canvas[prop].get('obj_id'));
                LayersManager.prototype.removeOnlyLayer(old_canvas[prop]);
                var cmd = new RemoveCanvasObjectClone(this.productDesigner, old_canvas[prop]);
                cmd.exec();
                History.prototype.push(cmd);
                old_canvas[prop].set({
                    mydesign: false,
                    isclone: true,
                    image_id: ProductDesigner.prototype.firstImageId
                });
                for (canvasId in ProductDesigner.prototype.containerCanvases) {
                    var canvasImageId = canvasId.split('&');
                    if ((prop3[1] == canvasImageId[1]) && ((ProductDesigner.prototype.firstImageId == canvasImageId[0] || ProductDesigner.prototype.currentProduct == canvasImageId[0]))) {
                        old_canvas[prop].set({
                            designarea_id: canvasId
                        });
                    }
                    if ((old_canvas[prop].type == 'text')) {
                        var flag = false;
                        if (old_canvas[prop].tab == 'grouporder') old_canvas[prop].set({
                            atmydesignadd: true,
                        });
                    }
                }
                var cmd = new InsertCanvasObject(this.productDesigner, old_canvas[prop], false);
                cmd.exec();
                History.prototype.push(cmd);
                if ((old_canvas[prop].type == 'text') && old_canvas[prop].atmydesignadd) {
                    if (old_canvas[prop].tab == 'grouporder') {
                        GroupDesigner.prototype.groupSide = ProductDesigner.prototype.currentDesignArea;
                    }
                }
            }
        }
        this.designChanged[this.currentProductColor] = true;
        this._observeNavButtons('disabled');
        ProductDesigner.prototype.setzIndexes();
    },
    _observeNavButtons: function(className) {
        var navButtons = this.data.nav;
        if (this.designChanged.hasOwnProperty(this.currentProductColor) && this.designChanged[this.currentProductColor] === true) {
            jQuery('#' + navButtons.saveDesign).removeClass(className);
            jQuery('#' + navButtons.saveDesign).removeAttr('disabled', 'disabled');
            jQuery('#' + navButtons.continueBtn).removeClass(className);
            jQuery('#' + navButtons.continueBtn).removeAttr('disabled', 'disabled');
            jQuery('#' + navButtons.downloadBtn).removeClass(className);
            jQuery('#' + navButtons.downloadBtn).removeAttr('disabled', 'disabled');
            ProductDesigner.prototype.shareImage = 0;
        } else if (!this.designChanged.hasOwnProperty(this.currentProductColor) || (this.designChanged.hasOwnProperty(this.currentProductColor) && this.designChanged[this.currentProductColor] === false)) {
            jQuery('#' + navButtons.saveDesign).addClass(className);
            jQuery('#' + navButtons.saveDesign).attr('disabled', 'disabled');
            ProductDesigner.prototype.shareImage = 1;
            if (!this.designId[this.currentProductColor]) {
                jQuery('#' + navButtons.continueBtn).removeClass(className);
                jQuery('#' + navButtons.continueBtn).removeAttr('disabled', 'disabled');
            } else {
                jQuery('#' + navButtons.continueBtn).removeClass(className);
                jQuery('#' + navButtons.continueBtn).removeAttr('disabled', 'disabled');
                jQuery('#' + navButtons.downloadBtn).removeClass(className);
                jQuery('#' + navButtons.downloadBtn).removeAttr('disabled', 'disabled');
            }
        }
    },
    observeHistory: function() {
        jQuery(document).on('changeHistoryEvent', function(e) {
            if (History.prototype.undoStack.length > 0 && this.canvasesHasDesigns()) {
                this.designChanged[this.currentProductColor] = true;
                this.observeGoOut();
            } else {
                this.designChanged[this.currentProductColor] = false;
                window.onbeforeunload = null
            }
            //this.designId[this.currentProductColor] = null;
            this._observeNavButtons('disabled');
            if (History.prototype.undoStack.length == 0) {
                jQuery('#undo').addClass('disabled');
                jQuery('#clearall').addClass('disabled');
            } else {
                jQuery('#undo').removeClass('disabled');
                jQuery('#clearall').removeClass('disabled');
            }
            if (History.prototype.redoStack.length == 0) {
                jQuery('#redo').addClass('disabled');
            } else {
                jQuery('#redo').removeClass('disabled');
            }
        }.bind(this));
    },
    observeSides: function() {
        jQuery('#left_side').on('click', function(e) {
            var canvas = this.canvas;
            for (var i = 0; i < canvas.getObjects().length; i++) {
                var object = canvas.getObjects()[i];
                var left;
                if (isNaN(this.data.side.left) || this.data.side.left == '') left = object.left;
                else left = object.left - parseFloat(this.data.side.left);
                var cmd = new UpdateCommand(canvas, object, {
                    left: left
                });
                cmd.exec();
                object.setCoords();
                History.prototype.push(cmd);
            }
            canvas.renderAll();
        }.bind(this));
        jQuery('#right_side').on('click', function(e) {
            var canvas = this.canvas;
            for (var i = 0; i < canvas.getObjects().length; i++) {
                var object = canvas.getObjects()[i];
                var left;
                if (isNaN(this.data.side.right) || this.data.side.right == '') left = object.left;
                else left = object.left + parseFloat(this.data.side.right);
                var cmd = new UpdateCommand(canvas, object, {
                    left: left
                });
                cmd.exec();
                object.setCoords();
                History.prototype.push(cmd);
            }
            canvas.renderAll();
        }.bind(this));
        jQuery('#top_side').on('click', function(e) {
            var canvas = this.canvas;
            for (var i = 0; i < canvas.getObjects().length; i++) {
                var object = canvas.getObjects()[i];
                var top;
                if (isNaN(this.data.side.top) || this.data.side.top == '') top = object.top;
                else top = object.top - parseFloat(this.data.side.top);
                var cmd = new UpdateCommand(canvas, object, {
                    top: top
                });
                cmd.exec();
                object.setCoords();
                History.prototype.push(cmd);
            }
            canvas.renderAll();
        }.bind(this));
        jQuery('#bottom_side').on('click', function(e) {
            var canvas = this.canvas;
            for (var i = 0; i < canvas.getObjects().length; i++) {
                var object = canvas.getObjects()[i];
                var top;
                if (isNaN(this.data.side.bottom) || this.data.side.bottom == '') top = object.top;
                else top = object.top + parseFloat(this.data.side.bottom);
                var cmd = new UpdateCommand(canvas, object, {
                    top: top
                });
                cmd.exec();
                object.setCoords();
                History.prototype.push(cmd);
            }
            canvas.renderAll();
        }.bind(this));
    },
    observeGoOut: function() {
        if (window.onbeforeunload == null) {
            window.onbeforeunload = function() {
                return 'The current design will be lost. Are you sure that you want to leave this page?';
            }
        }
    },
    observQtyChange: function() {
        jQuery('.size-qty').each(function(index, val) {
            jQuery(val).on('keyup', function(e, ele) {
                var totalQty = 0;
                var totalPrice = 0;
                jQuery('.size-qty').each(function(index, val) {
                    var qty = parseInt(jQuery(val).val());
                    totalQty = parseInt(totalQty) + qty;
                    var price = parseInt(jQuery(val).attr('data-price'));
                    totalPrice = totalPrice + (price * qty);
                }.bind(this));
                jQuery('#price_more_info_container #final-price').html(totalPrice);
                jQuery('#price_more_info_container #total_qty').html(totalQty);
                ProductDesigner.prototype.reloadPrintingPrice();
            }.bind(this));
        }.bind(this));
    },
    _observeControlButtons: function() {
        var controlButtons = this.data.controls;
        var method = this.canvas.getActiveObject() ? 'removeClass' : 'addClass';
        for (var key in controlButtons) {
            if ((key != 'undo' && key != 'redo' && key != 'clearall') && controlButtons.hasOwnProperty(key)) {
                var btn = jQuery(controlButtons[key]).selector;
                //btn[method].apply(btn, ['disabled']);
                if (method == 'addClass') {
                    jQuery('#' + btn).attr('disabled', 'disabled');
                    jQuery('#' + btn).addClass('disabled');
                }
                if (method == 'removeClass') {
                    jQuery('#' + btn).removeAttr('disabled');
                    jQuery('#' + btn).removeClass('disabled');
                }
            }
        }
    },
};
var RemoveCanvasObjectClone = function(designerWindow, obj, design_area_id) {
    if ((obj.designarea_id == undefined) || (obj.designarea_id == "null")) {
        var canvas = designerWindow.canvas;
    } else {
        for (var index in designerWindow.containerCanvases) { //var index1 = index.split ("&");
            if (index == obj.designarea_id) {
                var canvas = designerWindow.containerCanvases[index];
            }
        }
    }
    return {
        exec: function() {
            /*if(obj && obj != null)
             {
             designerWindow.layersManager.removeOutsideMark(obj.get('obj_id'));
             designerWindow.layersManager.removeOnlyLayer(obj);
             }*/
            for (var index in ProductDesigner.prototype.containerCanvases) {
                var canvas = ProductDesigner.prototype.containerCanvases[index];
                canvas.remove(obj);
            }
            //canvas.remove(obj);
            //Remove layer from object
            var layer_ul = jQuery("#layers_ul");
            if (jQuery(obj.get('obj_id'))) {
                jQuery('#' + obj.get('obj_id')).remove();
            }
            //Remove layer from object
            //ProductDesigner.prototype.reloadPrice();
            /* designerWindow.toggleImageSelectedClass(obj,'remove');
             */
            //delete designerWindow.ImageSideObject[ProductDesigner.prototype.currentImageSide+'_'+obj.get('obj_id')+'_'+ProductDesigner.prototype.currentDesignArea];
        },
        unexec: function() {
            ProductDesigner.prototype.canvas.add(obj);
            //Add layer From Object
            var layer_ul = jQuery("#layers_ul");
            var layer_li = document.createElement('li');
            layer_li.setAttribute('id', obj.get('obj_id'));
            layer_ul.append(layer_li);
            var layer_span_layer = document.createElement('span');
            layer_span_layer.setAttribute('id', 'layer');
            layer_span_layer.setAttribute('class', 'layer');
            layer_span_layer.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_layer.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            if (obj.type == 'text' || obj.type == 'group') {
                var layer_img = document.createElement('span');
                var layerText = obj.text;
                // layer_img.innerHTML = layerText.substr(0,6);
                layer_img.setAttribute('layer-obj', obj.get('obj_id'));
                layer_img.setAttribute('class', 'sprite ico-layer-text');
                layer_span_layer.appendChild(layer_img);
            } else if (obj.type == 'path' || obj.type == 'path-group') {
                var layer_img = document.createElement('span');
                var layerText = obj.text;
                // layer_img.innerHTML = layerText.substr(0,6);
                layer_img.setAttribute('layer-obj', obj.get('obj_id'));
                layer_img.setAttribute('class', 'sprite ico-layer-path');
                layer_span_layer.appendChild(layer_img);
            } else {
                var layer_img = document.createElement('img');
                if (obj.src.search('http') != -1) {
                    layer_img.setAttribute('src', obj.src);
                } else {
                    layer_img.setAttribute('src', ProductDesigner.prototype.mediaUrl + obj.src);
                }
                layer_img.setAttribute('layer-obj', obj.get('obj_id'));
                layer_img.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
                layer_img.setAttribute('id', 'layer');
                layer_img.setAttribute('class', 'layer');
                layer_span_layer.appendChild(layer_img);
            }
            layer_li.appendChild(layer_span_layer);
            var layer_span_action = document.createElement('span');
            layer_span_action.setAttribute('class', 'sprite ico-lock');
            layer_span_action.setAttribute('id', 'lock');
            layer_span_action.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_action.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_action.innerHTML = 'Lock';
            layer_li.appendChild(layer_span_action);
            var layer_span_front = document.createElement('span');
            layer_span_front.setAttribute('class', 'sprite ico-front');
            layer_span_front.setAttribute('id', 'front');
            layer_span_front.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_front.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_front.innerHTML = 'Bring Forward';
            layer_li.appendChild(layer_span_front);
            var layer_span_back = document.createElement('span');
            layer_span_back.setAttribute('class', 'sprite ico-back');
            layer_span_back.setAttribute('id', 'back');
            layer_span_back.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_back.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_back.innerHTML = 'Bring Forward';
            layer_li.appendChild(layer_span_back);
            var layer_span_delete = document.createElement('span');
            layer_span_delete.setAttribute('id', 'delete');
            layer_span_delete.setAttribute('class', 'sprite ico-delete');
            layer_span_delete.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_delete.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_delete.innerHTML = 'Delete';
            layer_li.appendChild(layer_span_delete);
            // Add layer in object
            canvas.setActiveObject(obj);
            obj.setCoords();
            canvas.renderAll();
            ProductDesigner.prototype.reloadPrice();
            designerWindow.toggleImageSelectedClass(obj, 'add');
        }
    }
};
var InsertCanvasObject = function(designerWindow, obj, alignByCenter, name, new2, new1, ext, change_side) {
    if ((obj.mydesign == true)) {
        obj.set({
            top: obj.top,
            left: obj.left,
            width: obj.width,
            height: obj.height,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            angle: obj.angle,
            tab: obj.tab,
            obj_side: obj.obj_side,
            obj_id: obj.obj_id,
            src: obj.src,
            used_colors_old: obj.used_colors_old,
        });
    }
    if ((obj.mydesign == true) || (obj.isclone == true) && !change_side) {
        if (obj.image_side == ProductDesigner.prototype.currentImageSide) {
            for (imageMulti in ProductDesigner.prototype.ImageMultipleArray) {
                if (ProductDesigner.prototype.ImageMultipleArray[obj.image_id] == true) { //if(1==1){
                    var index = obj.designarea_id;
                    ProductDesigner.prototype.currentDesignAreaId = index.split("&")[1];
                    var canvas = ProductDesigner.prototype.containerCanvases[obj.designarea_id];
                    this.productDesigner = ProductDesigner.prototype;
                } else {
                    var canvas = ProductDesigner.prototype.canvas;
                }
            }
        } else {
            for (imageMulti in ProductDesigner.prototype.ImageMultipleArray) {
                if (ProductDesigner.prototype.ImageMultipleArray[obj.image_id] == true) {
                    var index = obj.designarea_id;
                    ProductDesigner.prototype.currentDesignAreaId = index.split("&")[1];
                    var canvas = ProductDesigner.prototype.containerCanvases[obj.designarea_id];
                    this.productDesigner = ProductDesigner.prototype;
                } else {
                    var canvas = designerWindow.canvas;
                }
            }
        }
    } else {
        var canvas = designerWindow.canvas;
        //var canvas = designerWindow.canvas;
    }
    obj.set({
        change_side_group: false,
    });
    if (obj.obj_id == undefined) {
        obj.set('obj_id', 'id_' + Date.now());
    }
    /*change for multiple*/
    /*if(image_side)
     designerWindow.ImageSideObject[image_side+'_'+obj.obj_id] = obj;
     else*/
    if (obj.mydesign == true) {
        designerWindow.ImageSideObject[obj.image_side + '_' + obj.obj_id + '_' + obj.designarea_id] = obj;
        designerWindow.ImageSideAreaObject[obj.image_side + '_' + obj.obj_id + '_' + obj.designarea_id] = obj;
    } else {
        designerWindow.ImageSideObject[designerWindow.currentImageSide + '_' + obj.obj_id + '_' + designerWindow.currentProduct + '&' + designerWindow.currentDesignAreaId] = obj;
        //designerWindow.ImageSideAreaObject[designerWindow.currentImageSideArea[ProductDesigner.currentDesignAreaId] + '_' + obj.obj_id + '_' + ProductDesigner.currentProduct + '&' + ProductDesigner.currentDesignAreaId] = obj;
    }
    //
    //
    //
    obj.selectedColor = designerWindow.currentProductColor;
    // obj.set('image_side', designerWindow.currentImageSide);
    return {
        exec: function() {
            if (obj.group_type != undefined) {
                if (obj.group_type == 'name') {
                    ProductDesigner.prototype.nameAdd = true;
                } else {
                    ProductDesigner.prototype.numberAdd = true;
                }
            }
            if (obj.obj_id) {
                obj.set('obj_id', obj.obj_id);
            } else {
                obj.set('obj_id', 'id_' + Date.now());
            }
            if (name == 'groupTabName') {
                obj.set({
                    tab: 'grouporder',
                    name: 'groupTabName'
                });
            }
            if (name == 'groupTabNumber') {
                obj.set({
                    tab: 'grouporder',
                    name: 'groupTabNumber'
                });
            }
            if (name == 'textTabText') {
                obj.set({
                    tab: 'textTab',
                    name: 'textTabText'
                });
            }
            if (obj.type == 'text' && obj.name != 'groupTabNumber' && obj.name != 'groupTabName') {
                obj.set({
                    tab: 'text',
                });
            }
            // add object on canvas
            canvas.add(obj);
            obj.set({
                borderColor: 'red',
                cornerColor: 'green',
                cornerSize: 15,
                transparentCorners: false
            });
            obj.setControlsVisibility({
                mt: false, // middle top disable
                mb: false, // midle bottom
                ml: false, // middle left
                mr: false, // I think you get it
            });
            obj.lockMovementX = true;
            obj.lockMovementY = true;
            obj.hasControls = false;
            obj.hasBorders = false;
            ProductDesigner.prototype.canvas.setActiveObject(obj);
            if (obj.type == 'text' && (obj.mydesign == true || obj.isclone == true)) {
                if (obj.textarea == 'one') {
                    jQuery('#add_text_area').val(obj.text);
                } else if (obj.textarea == 'two') {
                    jQuery('#add_text_area_2').val(obj.text);
                }
            }
            if (obj.objFilters != undefined) {
                var filterss = obj.objFilters;
                for (var i = 0; i < filterss.length; i++) {
                    if (filterss[i].type != undefined) {
                        if (filterss[i].type == 'Tint') {
                            EffectDesigner.setObjColor(filterss[i].color);
                            /*$$('.clipart-color-img').each(function(index,val){
                             if(index.readAttribute('data-color_id') == filterss[i].color){
                             //canvas.setActiveObject(obj);
                             index.click();
                             index.up().addClassName('selected');
                             
                             }
                             });*/
                        } else {
                            // canvas.setActiveObject(obj);
                            //$(filterss[i].type).click();
                            if (filterss[i].type == 'Invert') {
                                var filter = new fabric.Image.filters.Invert();
                                obj.filters[i] = filter;
                                jQuery('#' + filterss[i].type).prop("checked", true)
                            }
                            if (filterss[i].type == 'Grayscale') {
                                var filter = new fabric.Image.filters.Grayscale();
                                obj.filters[i] = filter;
                                jQuery('#' + filterss[i].type).prop("checked", true)
                            }
                            if (filterss[i].type == 'Sepia') {
                                var filter = new fabric.Image.filters.Sepia();
                                obj.filters[i] = filter;
                                jQuery('#' + filterss[i].type).prop("checked", true)
                            }
                            if (filterss[i].type == 'Sepia2') {
                                var filter = new fabric.Image.filters.Sepia2();
                                obj.filters[i] = filter;
                                jQuery('#' + filterss[i].type).prop("checked", true)
                            }
                            obj.applyFilters(canvas.renderAll.bind(canvas));
                        }
                    }
                }
                obj.set({
                    objFilters: '',
                });
            }
            if (obj.used_colors_old != undefined && obj.used_colors_old != '') {
                if (obj.paths == undefined) {
                    var fill_color_hex = new RGBColor(obj.used_colors_old[0]);
                    obj.setFill(fill_color_hex.toHex());
                    canvas.renderAll();
                    obj.set({
                        used_colors_old: '',
                    });
                } else {
                    var index = 0;
                    for (var i = 0, len = obj.paths.length; i < len; i++) {
                        if (obj.paths[i].fill != '') {
                            var fill_color_hex = new RGBColor(obj.used_colors_old[index]);
                            obj.paths[i].setFill(fill_color_hex.toHex());
                            canvas.renderAll();
                            index++;
                        }
                    }
                    obj.set({
                        used_colors_old: '',
                    });
                }
            }
            if (obj.mydesign != undefined && obj.mydesign && !ProductDesigner.prototype.changedColor) {
                if (obj.tab == 'grouporder') {
                    GroupDesigner.prototype.sideChanged = 1;
                }
                canvas.setActiveObject(obj);
                obj.set({
                    mydesign: false,
                });
                if (obj.tab == 'grouporder') {
                    obj.set({
                        mydesign: true,
                    })
                }
            }
            var layer_ul = jQuery("#layers_ul");
            // layer_ul.setAttribute('class',ProductDesigner.currentDesignAreaId);
            var layer_li = document.createElement('li');
            layer_li.setAttribute('id', obj.get('obj_id'));
            layer_ul.append(layer_li);
            var layer_span_layer = document.createElement('span');
            layer_span_layer.setAttribute('id', 'layer');
            layer_span_layer.setAttribute('class', 'layer');
            layer_span_layer.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_layer.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            if (obj.type == 'text' || obj.type == 'group') {
                var layer_img = document.createElement('span');
                var layerText = obj.text;
                // layer_img.innerHTML = layerText.substr(0,6);
                layer_img.setAttribute('layer-obj', obj.get('obj_id'));
                layer_img.setAttribute('class', 'sprite ico-layer-text');
                layer_span_layer.appendChild(layer_img);
            } else if ((obj.type == 'path') || (obj.type == 'path-group') || (obj.type == 'group' && obj.tab != 'textTab')) {
                var layer_img = document.createElement('span');
                var layerText = obj.text;
                // layer_img.innerHTML = layerText.substr(0,6);
                layer_img.setAttribute('layer-obj', obj.get('obj_id'));
                layer_img.setAttribute('class', 'sprite ico-layer-path');
                layer_span_layer.appendChild(layer_img);
            } else {
                var layer_img = document.createElement('img');
                if (obj.type == 'image') {
                    if (obj.getElement() != null) layer_img.setAttribute('src', obj.getElement().src);
                    else layer_img.setAttribute('src', obj.src);
                } else {
                    layer_img.setAttribute('src', obj.src);
                }
                layer_img.width = 30;
                layer_img.setAttribute('layer-obj', obj.get('obj_id'));
                layer_img.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
                layer_img.setAttribute('id', 'layer');
                layer_img.setAttribute('class', 'layer');
                layer_span_layer.appendChild(layer_img);
            }
            layer_li.appendChild(layer_span_layer);
            var layer_span_action = document.createElement('span');
            if (obj.hasControls) layer_span_action.setAttribute('class', 'sprite ico-lock');
            else layer_span_action.setAttribute('class', 'sprite ico-locked');
            layer_span_action.setAttribute('id', 'lock');
            layer_span_action.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_action.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_action.innerHTML = 'Lock';
            layer_li.appendChild(layer_span_action);
            var layer_span_front = document.createElement('span');
            layer_span_front.setAttribute('class', 'sprite ico-front');
            layer_span_front.setAttribute('id', 'front');
            layer_span_front.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_front.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_front.innerHTML = 'Bring Forward';
            layer_li.appendChild(layer_span_front);
            var layer_span_back = document.createElement('span');
            layer_span_back.setAttribute('class', 'sprite ico-back');
            layer_span_back.setAttribute('id', 'back');
            layer_span_back.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_back.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_back.innerHTML = 'Bring Forward';
            layer_li.appendChild(layer_span_back);
            var layer_span_delete = document.createElement('span');
            layer_span_delete.setAttribute('id', 'delete');
            layer_span_delete.setAttribute('class', 'sprite ico-delete');
            layer_span_delete.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_delete.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_delete.innerHTML = 'Delete';
            layer_li.appendChild(layer_span_delete);
            // add object to layers manager
            LayersManager.prototype.add(obj);
            // alignment
            // alignment
            if (alignByCenter) {
                if (obj.tab == 'grouporder') {
                    obj.centerH();
                } else {
                    //obj.center();
                }
            };
            i
            /*f (ext == 'svg') {
                            obj.scaleToWidth(canvas.width - 40);
                            obj.center();
                        }*/
            canvas.setActiveObject(obj);
            obj.setCoords();
            ProductDesigner.prototype.canvas.renderAll();
            ProductDesigner.prototype.observColorCount();
            ProductDesigner.prototype.observColorCountObj();
            ProductDesigner.prototype.reloadPrice();
            designerWindow.toggleImageSelectedClass(obj, 'add');
            ProductDesigner.objScaleX = obj.scaleX;
            ProductDesigner.objScaleY = obj.scaleY;
        },
        unexec: function() {
            if (obj.group_type != undefined) {
                if (obj.group_type == 'name') {
                    ProductDesigner.prototype.nameAdd = false;
                } else {
                    ProductDesigner.prototype.numberAdd = false;
                }
            }
            var allObj = ProductDesigner.prototype.canvas.getObjects();
            for (var i = 0; i < allObj.length; i++) {
                if (obj.obj_id == allObj[i].obj_id) {
                    obj = allObj[i];
                }
            }
            //canvas.remove(obj);
            for (var index in ProductDesigner.prototype.containerCanvases) {
                var canvas = ProductDesigner.prototype.containerCanvases[index];
                canvas.remove(obj);
            }
            //remove object from layer
            var layer_ul = jQuery("#layers_ul");
            if (jQuery(obj.get('obj_id'))) {
                jQuery('#' + obj.get('obj_id')).remove();
            }
            //remove object from layer
            ProductDesigner.prototype.reloadPrice();
            //designerWindow.toggleImageSelectedClass(obj, 'remove');
        }
    };
};
var TextDesigner = function() {};
TextDesigner.prototype = {
    text_limit_data: null,
    initialize: function(textSize, textFamily, text_limit_data) {
        //if (!ProductDesigner.isAdmin) {
        require(['jquery', 'jquery/ui'], function($) {
            jQuery('#font_selection').prop('value', textFamily).selectric('refresh');
        });
        //}
        TextDesigner.text_limit_data = text_limit_data.data;
        this.observeTextAdd();
        this.observeText2Add();
        this.observeTextSizeChange();
        this.observeTextFontChange();
        this.observeTextStyleChange();
        this.observeTextAngleChange();
        this.observeTextSpaceChange();
        if (ProductDesigner.prototype.data.colorpicker_enable == 0) {
            this.getTextColorContent();
            this.observerTextColorChange();
            this.getTextBgColorContent();
            this.observerTextBgColorChange();
            this.getTextShadowColorContent();
            this.observerTextShadowColorChange();
            this.getGroupTextColorContent();
            this.observerGroupTextColorChange();
            this.getTextStrokeColorContent();
            this.observerTextStrokeColorChange();
        }
        this.defaultTextOpt = {
            fontFamily: textFamily,
            fontSize: textSize,
            text: '',
            strokeWidth: 1,
            opacity: 1,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0,
            textShadowBlur: 0
        };
        this.fieldsMap = {
                text: jQuery('#add_text_area'),
                text2: jQuery('#add_text_area_2'),
                fontFamily: jQuery('#font_selection'),
                fontSize: jQuery('#font_size_selection'),
                strokeWidth: jQuery('#stroke_width'),
                textShadowOffsetX: jQuery('#shadow_x_range'),
                textShadowOffsetY: jQuery('#shadow_y_range'),
                textShadowBlur: jQuery('#shadow_blur')
            },
            this.buttonsMap = {
                fontWeight: jQuery('#add_btn_bold'),
                fontStyle: jQuery('#add_btn_italic'),
                textDecoration: jQuery('#add_btn_underline')
            },
            this.alignment = {
                textAlignLeft: jQuery('#btn_left_align'),
                textAlignRight: jQuery('#btn_right_align'),
                textAlignCenter: jQuery('#btn_center_align')
            },
            this.textColorMap = {
                fill: jQuery('#text_color'),
                textBackgroundColor: jQuery('#text_bg_color'),
                GroupTextColor: jQuery('#group_text_color')
            }
        this.observeTextTabShow();
        this.applyFontFamily();
    },
    getGroupTextColorContent: function() {
        if (jQuery('#group_text_color')) {
            jQuery('#group_text_color').on('click', function(e) {
                /*$('text-shadowcolor-container').style.display = 'none';
                 $('text-bgcolor-container').style.display = 'none';
                 $('text-color-container').style.display = 'none';*/
                jQuery('#text-shadowcolor-container').hide();
                jQuery('#text-bgcolor-container').hide();
                jQuery('#text-color-container').hide();
                jQuery('#grouptext-color-container').toggle();
            });
        }
    },
    observerGroupTextColorChange: function() {
        jQuery('#grouptext-color-container').on('click', '.grouptext-color-img', function(event) {
            var self = this;
            var ele = event.target;
            var color = event.target.getAttribute('data-color_id');
            TextDesigner.setTextColor(color);
            jQuery('#grouptext_color_title').html(event.target.getAttribute('data-color_name'));
            //jQuery('#grouptext_color_title').innerHTML = event.target.getAttribute('data-color_name');
            /*$$('.grouptext-color-img').each(function (index, val) {
             index.up().removeClassName('selected');
             });
             ele.up().addClassName('selected');*/
            jQuery('grouptext-color-container').hide();
            this.productDesigner = ProductDesigner.prototype;
            var canvas = ProductDesigner.prototype.canvas;
            var obj = canvas.getActiveObject();
            if (obj && obj != null) {
                field = jQuery('group_text_color');
                /*field.down().style.borderColor = obj.fill ? obj.fill : '#FFFFFF';*/
            }
        });
    },
    getTextStrokeColorContent: function() {
        jQuery('#text_stroke_color').on('click', function(e) {
            jQuery('#text-color-container').hide();
            jQuery('#text-bgcolor-container').hide();
            jQuery('#text-shadowcolor-container').hide();
            jQuery('#text-bgcolor-container').hide();
            jQuery('#text-color-container').hide();
            jQuery('#text-strokecolor-container').toggle();
        });
    },
    observerTextStrokeColorChange: function() {
        jQuery('#text-strokecolor-container').on('click', '.text-strokecolor-img', function(event) {
            var self = this;
            var ele = event.target;
            var color = event.target.getAttribute('data-color_id');
            // jQuery('#text_stroke_color_field').val() = color;
            TextDesigner.setTextStrokeColor(color);
            jQuery('#text_strokecolor_title').html(event.target.getAttribute('data-color_name'));
            /*jQuery('#text_bgcolor_title').innerHTML = event.target.getAttribute('data-color_name');*/
            /*$$('.text-strokecolor-img').each(function (index, val) {
             index.up().removeClassName('selected');
             });
             ele.up().addClassName('selected');*/
            jQuery('#text-strokecolor-container').hide();
        });
    },
    getTextColorContent: function() {
        jQuery('#text_color').on('click', function(e) {
            /*$('text-strokecolor-container').hide();
             $('text-shadowcolor-container').style.display = 'none';
             $('text-bgcolor-container').style.display = 'none';*/
            jQuery('#text-strokecolor-container').hide();
            jQuery('#text-shadowcolor-container').hide();
            jQuery('#text-bgcolor-container').hide();
            jQuery('#text-color-container').toggle();
        });
    },
    observerTextColorChange: function() {
        jQuery('#text-color-container').on('click', '.text-color-img', function(event) {
            var self = this;
            var ele = event.target;
            var color = event.target.getAttribute('data-color_id');
            TextDesigner.setTextColor(color);
            jQuery('#text_color_title').html(event.target.getAttribute('data-color_name'));
            /*jQuery('.text-color-img').each(function (val, index) {
             index.parent().removeClassName('selected'); 
             });
             ele.parent().addClassName('selected');*/
            jQuery('#text-color-container').hide();
        });
    },
    getTextBgColorContent: function() {
        jQuery('#text_bg_color').on('click', function(e) {
            /*$('text-strokecolor-container').hide();
             $('text-shadowcolor-container').style.display = 'none';
             $('text-color-container').style.display = 'none';*/
            jQuery('#text-strokecolor-container').hide();
            jQuery('#text-shadowcolor-container').hide();
            jQuery('#text-color-container').hide();
            jQuery('#text-bgcolor-container').toggle();
        });
    },
    observerTextBgColorChange: function() {
        jQuery('#text-bgcolor-container').on('click', '.text-bgcolor-img', function(event) {
            var self = this;
            var ele = event.target;
            var color = event.target.getAttribute('data-color_id');
            TextDesigner.setTextBgColor(color);
            jQuery('#text_bgcolor_title').html(event.target.getAttribute('data-color_name'));
            /*$$('.text-bgcolor-img').each(function (index, val) {
             index.up().removeClassName('selected');
             });
             ele.up().addClassName('selected');*/
            jQuery('#text-bgcolor-container').hide();
        });
    },
    getTextShadowColorContent: function() {
        jQuery('#text_shadow_color').on('click', function(e) {
            /*$('text-color-container').hide();
             $('text-bgcolor-container').hide();
             $('text-bgcolor-container').style.display = 'none';
             $('text-color-container').style.display = 'none';*/
            jQuery('#text-color-container').hide();
            jQuery('#text-bgcolor-container').hide();
            jQuery('#text-bgcolor-container').hide();
            jQuery('#text-color-container').hide();
            jQuery('#text-shadowcolor-container').toggle();
        });
    },
    observerTextShadowColorChange: function() {
        jQuery('#text-shadowcolor-container').on('click', '.text-shadowcolor-img', function(event) {
            var self = this;
            var ele = event.target;
            var color = event.target.getAttribute('data-color_id');
            jQuery('#text_shadow_color_field').value = color;
            TextDesigner.setTextShadowColor(color);
            jQuery('#text_shadowcolor_title').html(event.target.getAttribute('data-color_name'));
            /*jQuery('#text_bgcolor_title').innerHTML = event.target.getAttribute('data-color_name');*/
            /*$$('.text-shadowcolor-img').each(function (index, val) {
             index.up().removeClassName('selected');
             });
             ele.up().addClassName('selected');*/
            jQuery('#text-shadowcolor-container').hide();
        });
    },
    observeTextTabShow: function() {
        jQuery(document).on('textTabShow', function(e) {
            var textObj = e.originalEvent.obj || null;
            this._setInputValues(textObj);
        }.bind(this));
    },
    applyFontFamily: function() {
        jQuery('.font_option').each(function(index, val) {
            jQuery(val).css('font-family', 'jQuery(val).val()');
        });
    },
    observeTextFontChange: function() {
        jQuery('.font_selection').on('selectric-init', function(element) {
            jQuery('.text_styles .custom-fonts').each(function(index, val) {
                val.style.fontFamily = val.innerHTML;
            });
        });
        jQuery('.font_selection').on('selectric-change', function(element) {
            this.productDesigner = ProductDesigner.prototype;
            var canvas = this.productDesigner.canvas;
            var obj = canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'custom_text' || obj.type == 'group')) {
                var cmd = new UpdateCommand(canvas, obj, {
                    fontFamily: jQuery('#font_selection').val()
                });
                if (obj.tab == 'grouporder') {
                    var cmd = new UpdateCommand(canvas, obj, {
                        fontFamily: jQuery('#group_font_selection').val()
                    });
                } else {
                    if (obj.text_type == 'quote') var cmd = new UpdateCommand(canvas, obj, {
                        fontFamily: jQuery('#font_selection').val()
                    }, "center");
                    else var cmd = new UpdateCommand(canvas, obj, {
                        fontFamily: jQuery('#font_selection').val()
                    });
                }
                cmd.exec();
                History.prototype.push(cmd);
            }
        }.bind(this));
    },
    observeTextAngleChange: function() {
        jQuery('#text_arc').on('change input', function() {
            this.productDesigner = ProductDesigner.prototype;
            var canvas = this.productDesigner.canvas;
            var obj = canvas.getActiveObject();
            if (obj && obj.tab == 'groupTab') {
                return false;
            }
            var currentArc = parseInt(jQuery('#text_arc').val());
            var currentSpacing = parseInt(jQuery('#text_spacing').val());
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var defaultArc = obj.arc ? obj.arc : 0;
                var defaultSpacing = obj.spacing ? obj.spacing : 0;
                cmd = new TextSpaceAngleChange(this.productDesigner, canvas, {
                    arc: defaultArc,
                    spacing: defaultSpacing
                }, {
                    arc: currentArc,
                    spacing: currentSpacing
                });
                cmd.exec();
                History.prototype.push(cmd);
            }
        }.bind(this));
    },
    observeTextSpaceChange: function() {
        jQuery('#text_spacing').on('change input', function() {
            this.productDesigner = ProductDesigner.prototype;
            var canvas = this.productDesigner.canvas;
            var obj = canvas.getActiveObject();
            if (obj && obj.tab == 'groupTab') {
                return false;
            }
            var currentArc = parseInt(jQuery('#text_arc').val());
            var currentSpacing = parseInt(jQuery('#text_spacing').val());
            if (obj && obj.type == 'text' || obj.type == 'group') {
                var defaultArc = obj.arc ? obj.arc : 0;
                var defaultSpacing = obj.spacing ? obj.spacing : 0;
                var cmd = new TextSpaceAngleChange(this.productDesigner, canvas, {
                    arc: defaultArc,
                    spacing: defaultSpacing
                }, {
                    arc: currentArc,
                    spacing: currentSpacing
                });
                cmd.exec();
                History.prototype.push(cmd);
            }
        }.bind(this));
    },
    setTextColor: function(color) {
        this.productDesigner = ProductDesigner.prototype;
        var canvas = this.productDesigner.canvas;
        var obj = canvas.getActiveObject();
        if (obj && (obj.type == 'text' || obj.type == 'group')) {
            var cmd = new UpdateCommand(canvas, obj, {
                fill: color
            });
            cmd.exec();
            jQuery('#text_color').children().css("borderColor", color);
            History.prototype.push(cmd);
        }
    },
    setGroupTextColor: function(color) {
        this.productDesigner = ProductDesigner.prototype;
        var canvas = this.productDesigner.canvas;
        var obj = canvas.getActiveObject();
        if (obj && (obj.type == 'text' || obj.type == 'group') && (obj.tab == 'grouporder')) {
            var cmd = new UpdateCommand(canvas, obj, {
                fill: color
            });
            cmd.exec();
            jQuery('#group_text_color').children().css('border-color', color);
            History.prototype.push(cmd);
        }
    },
    setTextBgColor: function(color) {
        this.productDesigner = ProductDesigner.prototype;
        var canvas = this.productDesigner.canvas;
        var obj = canvas.getActiveObject();
        if (obj && (obj.type == 'text' || obj.type == 'group')) {
            if (!jQuery('#text_bg_null').checked) {
                var cmd = new UpdateCommand(canvas, obj, {
                    textBackgroundColor: obj.textBackgroundColor != color ? color : ''
                });
                cmd.exec();
                jQuery('#text_bg_color span').css("borderColor", color);
                History.prototype.push(cmd);
            }
        }
    },
    setTextStrokeColor: function(color) {
        this.productDesigner = ProductDesigner.prototype;
        var canvas = this.productDesigner.canvas;
        var obj = canvas.getActiveObject();
        if (obj && (obj.type == 'text' || obj.type == 'group')) {
            if (!jQuery('#text_stroke_color').checked) {
                var stroke_color = color;
                var cmd = new UpdateCommand(canvas, obj, {
                    stroke: stroke_color
                });
                cmd.exec();
                jQuery('#text_stroke_color').children().css("borderColor", color);
                History.prototype.push(cmd);
            }
        }
    },
    setTextShadowColor: function(color) {
        this.productDesigner = ProductDesigner.prototype;
        var canvas = this.productDesigner.canvas;
        var obj = canvas.getActiveObject();
        if (obj && (obj.type == 'text' || obj.type == 'group')) {
            var x_offset = jQuery('#shadow_x_range').val();
            var y_offset = jQuery('#shadow_y_range').val();
            var blur = jQuery('#shadow_blur').val();
            var shadow_color = color;
            var shadow = shadow_color + ' ' + x_offset + 'px' + ' ' + y_offset + 'px' + ' ' + blur + 'px';
            var cmd = new UpdateCommand(canvas, obj, {
                shadow: shadow
            });
            cmd.exec();
            jQuery('#text_shadow_color').children().css("borderColor", color);
            History.prototype.push(cmd);
        }
    },
    observeTextAdd: function() {
        jQuery("#add_text_area").keypress(function(event) {
            if (event.which == 13) {
                event.preventDefault(); //Add this line to your code
            }
        });
        jQuery('#add_text_area').on('click', function(e) {
            this.productDesigner = ProductDesigner.prototype;
            var canvas = this.productDesigner.canvas;
            var allObj = canvas.getObjects();
            canvas.deactivateAll().renderAll();
            for (var i = 0; i < allObj.length; i++) {
                if (allObj[i].textarea != "undefined") {
                    if (allObj[i].textarea == 'one') {
                        canvas.setActiveObject(allObj[i]);
                        break;
                    }
                }
            }
        });
        jQuery('#add_text_area').on('keyup', function(e) {
            this.productDesigner = ProductDesigner.prototype;
            var canvas = this.productDesigner.canvas;
            var allObj = canvas.getObjects();
            var obj = canvas.getActiveObject();
            if (!jQuery('#add_text_area').val() && e.which != 13 && obj) {
                var cmd = new RemoveCanvasObject(this.productDesigner, obj);
                cmd.exec();
                jQuery('#text_prop_container').addClass('disabled');
                History.prototype.push(cmd);
                return;
            }
            if (jQuery('#add_text_area').val()) {
                if (e.which == 13 || e.which == 46) {
                    if (jQuery('#add_text_area')[0].selectionEnd == jQuery('#add_text_area').val().length) {
                        return;
                    }
                }
                var text = jQuery('#add_text_area').val();
                var a = new RGBColor(jQuery('#text_color span').css('border-color'));
                var textObjectData = {
                    fontSize: parseInt(jQuery('#font_size_selection').val()),
                    fontFamily: jQuery('#font_selection').val(),
                    /*fill: a.toHex(),*/
                    obj_side: this.productDesigner.data.product.images[this.productDesigner.currentProductColor][this.productDesigner.currentProduct].side
                };
                if (obj && (obj.type == 'text' || obj.type == 'group')) {
                    if (obj.type == 'group') {
                        for (var i = 0; i < obj.getObjects().length; i++) {
                            var newObj = obj.getObjects()[i];
                            if (newObj.type == 'text') {
                                oldText = oldText + newObj.getText();
                            }
                        }
                        if (text != oldText) {
                            var cmd = new RemoveCanvasObject(this.productDesigner, obj);
                            cmd.exec();
                            History.prototype.push(cmd);
                            var textObjectData = {
                                fontSize: parseInt(jQuery('#font_size_selection').val()),
                                fontFamily: jQuery('#font_selection').val(),
                                fill: a.toHex(),
                                opacity: jQuery('#opacity').val(),
                            };
                            var textObject = new fabric.Text(text, textObjectData);
                            textObject.set({
                                top: obj.top,
                                left: obj.left,
                                image_side: obj.image_side,
                                scaleX: obj.scaleX,
                                scaleY: obj.scaleY,
                                width: obj.width,
                                height: obj.height,
                                textarea: 'one',
                            });
                            var cmd = new InsertCanvasObject(this.productDesigner, textObject, true);
                            cmd.exec();
                            History.prototype.push(cmd);
                            var currentArc = parseInt(jQuery('#text_arc').val());
                            var currentSpacing = parseInt(jQuery('#text_spacing').val());
                            var defaultArc = obj.arc ? obj.arc : 0;
                            var defaultSpacing = obj.spacing ? obj.spacing : 0;
                            cmd = new TextSpaceAngleChange(this.productDesigner, canvas, {
                                arc: defaultArc,
                                spacing: defaultSpacing
                            }, {
                                arc: currentArc,
                                spacing: currentSpacing
                            });
                            cmd.exec();
                            History.prototype.push(cmd);
                        }
                    } else {
                        oldText = obj.getText();
                        if (text != oldText) {
                            var cmd = new UpdateCommand(canvas, obj, {
                                text: text
                            });
                            cmd.exec();
                            jQuery('#text_prop_container').removeClass("disabled");
                            History.prototype.push(cmd);
                        }
                    }
                } else {
                    var textCount = 0;
                    if (TextDesigner.text_limit_data.is_limit == 1) {
                        var canvas = this.productDesigner.canvas;
                        var allObj = canvas.getObjects();
                        for (var i = 0; i < allObj.length; i++) {
                            if (allObj[i].type == 'text' || allObj[i].type == 'group') {
                                textCount++;
                            }
                        }
                        if (textCount > parseInt(TextDesigner.text_limit_data.limit) - 1) {
                            jQuery('#add_text_area').val("");
                            alert(TextDesigner.text_limit_data.limit_text);
                            return false;
                        }
                    }
                    var textObject = new fabric.Text(text, textObjectData);
                    if (jQuery('#add_text_area_2').val() != null && jQuery('#add_text_area_2').val() != '') {
                        var allObj = canvas.getObjects();
                        for (var i = 0; i < allObj.length; i++) {
                            if (allObj[i].textarea != "undefined") {
                                if (allObj[i].textarea == 'two') {
                                    if (isMobile.any()) {
                                        var cmd = new UpdateCommand(canvas, allObj[i], {
                                            top: 5
                                        });
                                    } else {
                                        var cmd = new UpdateCommand(canvas, allObj[i], {
                                            top: 18
                                        });
                                    }
                                    cmd.exec();
                                    allObj[i].setCoords();
                                }
                            }
                        }
                        if (isMobile.any()) {
                            var topPosition = 2;
                        } else {
                            var topPosition = 10;
                        }
                    } else {
                        var topPosition = canvas.height / 2;
                    }
                    var allObj = canvas.getObjects();
                    var leftPosition = 10;
                    for (var i = 0; i < allObj.length; i++) {
                        if (allObj[i] && (allObj[i].type == 'image' || allObj[i].type == 'path' || allObj[i].type == 'path-group')) {
                            leftPosition = 35;
                        }
                    }
                    textObject.set({
                        textarea: 'one',
                        left: leftPosition,
                        top: topPosition
                    });
                    var cmd = new InsertCanvasObject(this.productDesigner, textObject, true);
                    cmd.exec();
                    if (jQuery('#add_text_area_2').val() == null || jQuery('#add_text_area_2').val() == '') {
                        textObject.centerV();
                    }
                    jQuery('#add_text_area').focus();
                    jQuery('#add_text_area')[0].selectionStart = jQuery('#add_text_area')[0].selectionEnd = jQuery('#add_text_area').val().length;
                    jQuery('#text_prop_container').removeClass("disabled");
                    History.prototype.push(cmd);
                    jQuery('#text_color_title').html('Black');
                    jQuery('#text_bgcolor_title').html('Black');
                    jQuery('#text_shadowcolor_title').html('Black');
                    jQuery('#text_strokecolor_title').html('Black');
                }
            }
        });
    },
    observeText2Add: function() {
        jQuery("#add_text_area_2").keypress(function(event) {
            if (event.which == 13) {
                event.preventDefault(); //Add this line to your code
            }
        });
        jQuery('#add_text_area_2').on('click', function(e) {
            this.productDesigner = ProductDesigner.prototype;
            var canvas = this.productDesigner.canvas;
            var allObj = canvas.getObjects();
            canvas.deactivateAll().renderAll();
            for (var i = 0; i < allObj.length; i++) {
                if (allObj[i].textarea != "undefined") {
                    if (allObj[i].textarea == 'two') {
                        canvas.setActiveObject(allObj[i]);
                        break;
                    }
                }
            }
        });
        jQuery('#add_text_area_2').on('keyup', function(e) {
            this.productDesigner = ProductDesigner.prototype;
            var canvas = this.productDesigner.canvas;
            var allObj = canvas.getObjects();
            var obj = canvas.getActiveObject();
            if (!jQuery('#add_text_area_2').val() && e.which != 13 && obj) {
                var cmd = new RemoveCanvasObject(this.productDesigner, obj);
                cmd.exec();
                jQuery('#text_prop_container').addClass('disabled');
                History.prototype.push(cmd);
                for (var i = 0; i < allObj.length; i++) {
                    if (allObj[i].textarea != "undefined") {
                        if (allObj[i].textarea == 'one') {
                            allObj[i].centerV();
                        }
                    }
                }
                return;
            }
            if (jQuery('#add_text_area_2').val()) {
                if (e.which == 13 || e.which == 46) {
                    if (jQuery('#add_text_area_2')[0].selectionEnd == jQuery('#add_text_area_2').val().length) {
                        return;
                    }
                }
                var text = jQuery('#add_text_area_2').val();
                var a = new RGBColor(jQuery('#text_color span').css('border-color'));
                var textObjectData = {
                    fontSize: parseInt(jQuery('#font_size_selection').val()),
                    fontFamily: jQuery('#font_selection').val(),
                    /*fill: a.toHex(),*/
                    obj_side: this.productDesigner.data.product.images[this.productDesigner.currentProductColor][this.productDesigner.currentProduct].side
                };
                if (obj && (obj.type == 'text' || obj.type == 'group')) {
                    if (obj.type == 'group') {
                        for (var i = 0; i < obj.getObjects().length; i++) {
                            var newObj = obj.getObjects()[i];
                            if (newObj.type == 'text') {
                                oldText = oldText + newObj.getText();
                            }
                        }
                        if (text != oldText) {
                            var cmd = new RemoveCanvasObject(this.productDesigner, obj);
                            cmd.exec();
                            History.prototype.push(cmd);
                            var textObjectData = {
                                fontSize: parseInt(jQuery('#font_size_selection').val()),
                                fontFamily: jQuery('#font_selection').val(),
                                fill: a.toHex(),
                                opacity: jQuery('#opacity').val(),
                            };
                            var textObject = new fabric.Text(text, textObjectData);
                            textObject.set({
                                top: obj.top,
                                left: obj.left,
                                image_side: obj.image_side,
                                scaleX: obj.scaleX,
                                scaleY: obj.scaleY,
                                width: obj.width,
                                height: obj.height,
                                textarea: 'two',
                            });
                            var cmd = new InsertCanvasObject(this.productDesigner, textObject, true);
                            cmd.exec();
                            History.prototype.push(cmd);
                            var currentArc = parseInt(jQuery('#text_arc').val());
                            var currentSpacing = parseInt(jQuery('#text_spacing').val());
                            var defaultArc = obj.arc ? obj.arc : 0;
                            var defaultSpacing = obj.spacing ? obj.spacing : 0;
                            cmd = new TextSpaceAngleChange(this.productDesigner, canvas, {
                                arc: defaultArc,
                                spacing: defaultSpacing
                            }, {
                                arc: currentArc,
                                spacing: currentSpacing
                            });
                            cmd.exec();
                            History.prototype.push(cmd);
                        }
                    } else {
                        oldText = obj.getText();
                        if (text != oldText) {
                            var cmd = new UpdateCommand(canvas, obj, {
                                text: text
                            });
                            cmd.exec();
                            jQuery('#text_prop_container').removeClass("disabled");
                            History.prototype.push(cmd);
                        }
                    }
                } else {
                    var textCount = 0;
                    if (TextDesigner.text_limit_data.is_limit == 1) {
                        var canvas = this.productDesigner.canvas;
                        var allObj = canvas.getObjects();
                        for (var i = 0; i < allObj.length; i++) {
                            if (allObj[i].type == 'text' || allObj[i].type == 'group') {
                                textCount++;
                            }
                        }
                        if (textCount > parseInt(TextDesigner.text_limit_data.limit) - 1) {
                            jQuery('#add_text_area_2').val("");
                            alert(TextDesigner.text_limit_data.limit_text);
                            return false;
                        }
                    }
                    var textObject = new fabric.Text(text, textObjectData);
                    if (jQuery('#add_text_area_2').val() != null && jQuery('#add_text_area_2').val() != '') {
                        var allObj = canvas.getObjects();
                        for (var i = 0; i < allObj.length; i++) {
                            if (allObj[i].textarea != "undefined") {
                                if (allObj[i].textarea == 'one') {
                                    if (isMobile.any()) {
                                        var cmd = new UpdateCommand(canvas, allObj[i], {
                                            top: 0
                                        });
                                    } else {
                                        var cmd = new UpdateCommand(canvas, allObj[i], {
                                            top: 10
                                        });
                                    }
                                    cmd.exec();
                                    allObj[i].setCoords();
                                }
                            }
                        }
                    }
                    if (isMobile.any()) {
                        var topPosition = 5;
                        var leftPosition = 10;
                    } else {
                        var topPosition = 18;
                        var leftPosition = 10;
                    }
                    for (var i = 0; i < allObj.length; i++) {
                        if (allObj[i] && (allObj[i].type == 'image' || allObj[i].type == 'path' || allObj[i].type == 'path-group')) {
                            leftPosition = 35;
                        }
                    }
                    textObject.set({
                        textarea: 'two',
                        left: leftPosition,
                        top: topPosition
                    });
                    var cmd = new InsertCanvasObject(this.productDesigner, textObject, true);
                    cmd.exec();
                    jQuery('#add_text_area_2').focus();
                    jQuery('#add_text_area_2')[0].selectionStart = jQuery('#add_text_area_2')[0].selectionEnd = jQuery('#add_text_area_2').val().length;
                    jQuery('#text_prop_container').removeClass("disabled");
                    History.prototype.push(cmd);
                    jQuery('#text_color_title').html('Black');
                    jQuery('#text_bgcolor_title').html('Black');
                    jQuery('#text_shadowcolor_title').html('Black');
                    jQuery('#text_strokecolor_title').html('Black');
                }
            }
        });
    },
    observeTextSizeChange: function() {
        jQuery('#font_size_selection').on('change input', function() {
            this.productDesigner = ProductDesigner.prototype;
            var canvas = this.productDesigner.canvas;
            var obj = canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var cmd = new UpdateCommand(canvas, obj, {
                    fontSize: jQuery('#font_size_selection').val()
                });
                cmd.exec();
                History.prototype.push(cmd);
            }
        }.bind(this));
    },
    observeTextStyleChange: function() {
        this.productDesigner = ProductDesigner.prototype;
        jQuery('#add_btn_bold').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var fontWeight = !obj.fontWeight || obj.fontWeight != 'bold' ? 'bold' : '400'
                if (obj.type == 'group' && obj._objects && obj._objects[0].fontWeight) {
                    var fontWeight = !obj._objects[0].fontWeight || obj._objects[0].fontWeight != 'bold' ? 'bold' : '400'
                }
                var cmd = new UpdateCommand(canvas, obj, {
                    fontWeight: fontWeight
                });
                cmd.exec();
                History.prototype.push(cmd);
                if (obj.fontWeight == 'bold' || (obj.type == 'group' && obj.getObjects()[0].fontWeight == 'bold')) {
                    jQuery('#add_btn_bold').addClass('selected');
                } else {
                    jQuery('#add_btn_bold').removeClass('selected');
                }
            }
        }.bind(this));
        jQuery('#add_btn_italic').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var fontStyle = !obj.fontStyle ? 'italic' : '';
                if (obj.type == 'group' && obj._objects && obj._objects[0].fontStyle) {
                    var fontStyle = !obj._objects[0].fontStyle ? 'italic' : '';
                }
                var cmd = new UpdateCommand(canvas, obj, {
                    fontStyle: fontStyle
                });
                cmd.exec();
                History.prototype.push(cmd);
                if (obj.fontStyle == 'italic' || (obj.type == 'group' && obj.getObjects()[0].fontStyle == 'italic')) {
                    jQuery('#add_btn_italic').addClass('selected');
                } else {
                    jQuery('#add_btn_italic').removeClass('selected');
                }
            }
        }.bind(this));
        jQuery('#add_btn_underline').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var textDecoration = !obj.textDecoration ? 'underline' : '';
                if (obj.type == 'group' && obj._objects && obj._objects[0].textDecoration) {
                    var textDecoration = !obj._objects[0].textDecoration ? 'underline' : '';
                }
                var cmd = new UpdateCommand(canvas, obj, {
                    textDecoration: textDecoration
                });
                cmd.exec();
                History.prototype.push(cmd);
                if (obj.textDecoration == 'underline' || (obj.type == 'group' && obj.getObjects()[0].textDecoration == 'underline')) {
                    jQuery('#add_btn_underline').addClass('selected');
                } else {
                    jQuery('#add_btn_underline').removeClass('selected');
                }
            }
        }.bind(this));
        jQuery('#add_btn_shadow').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var elem = e.target || e.srcElement;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                this.toggleTextEffectPopup(elem);
                var x_offset = jQuery('#shadow_x_range').val();
                var y_offset = jQuery('#shadow_y_range').val();
                var blur = jQuery('#shadow_blur').val();
                var shadow_color = jQuery('#text_shadow_color span').css('border-bottom-color');
                var shadow_color1 = new RGBColor(shadow_color);
                var shadow_color2 = shadow_color1.toHex();
                if (obj.type == 'group' && obj._objects && obj._objects[0].shadow) {
                    var x_offset = obj._objects[0].shadow.offsetX ? obj._objects[0].shadow.offsetX : jQuery('#shadow_x_range').val();
                    var y_offset = obj._objects[0].shadow.offsetY ? obj._objects[0].shadow.offsetY : jQuery('#shadow_y_range').val();
                    var blur = obj._objects[0].shadow.blur ? obj._objects[0].shadow.blur : jQuery('#shadow_blur').val();
                    var shadow_color2 = obj._objects[0].shadow.color ? obj._objects[0].shadow.color : 'FFFFFF';
                }
                jQuery('#text_shadow_color span').css('border-color', shadow_color2);
                var shadow = shadow_color2 + ' ' + x_offset + 'px' + ' ' + y_offset + 'px' + ' ' + blur + 'px';
                var cmd = new UpdateCommand(canvas, obj, {
                    shadow: shadow
                });
                cmd.exec();
                History.prototype.push(cmd);
            }
        }.bind(this));
        jQuery('#reset_shadow').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            //$('add_btn_shadow_config').style.display = 'none';
            jQuery('#shadow_x_range').val(0);
            jQuery('#shadow_y_range').val(0);
            jQuery('#shadow_blur').val(0);
            jQuery("#text_shadow_color span").css("border-color", "black");
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var cmd = new UpdateCommand(canvas, obj, {
                    shadow: ''
                });
                cmd.exec();
                History.prototype.push(cmd);
                jQuery('.btn_font_effect').each(function(index, val) {
                    jQuery(index.id).removeClass('active');
                });
            }
        }.bind(this));
        jQuery('#opacity').on('change input', function() {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var text_opacity = parseFloat(jQuery('#opacity').val());
                if (obj.opacity != text_opacity) {
                    var cmd = new UpdateCommand(canvas, obj, {
                        opacity: text_opacity
                    });
                    cmd.exec();
                }
                History.prototype.push(cmd);
            }
        }.bind(this));
        jQuery('#btn_left_align').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'custom_text')) {
                var cmd = new UpdateCommand(canvas, obj, {
                    textAlign: 'left'
                });
                cmd.exec();
                History.prototype.push(cmd);
                if (obj.textAlign == 'left') {
                    jQuery('#btn_left_align').addClass('selected');
                    jQuery('#btn_right_align').removeClass('selected');
                    jQuery('#btn_center_align').removeClass('selected');
                } else {
                    jQuery('#btn_left_align').removeClass('selected');
                }
            }
        }.bind(this));
        jQuery('#btn_right_align').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'custom_text')) {
                var cmd = new UpdateCommand(canvas, obj, {
                    textAlign: 'right'
                });
                cmd.exec();
                History.prototype.push(cmd);
                if (obj.textAlign == 'right') {
                    jQuery('#btn_right_align').addClass('selected');
                    jQuery('#btn_left_align').removeClass('selected');
                    jQuery('#btn_center_align').removeClass('selected');
                } else {
                    jQuery('#btn_right_align').removeClass('selected');
                }
            }
        }.bind(this));
        jQuery('#btn_center_align').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'custom_text')) {
                var cmd = new UpdateCommand(canvas, obj, {
                    textAlign: 'center'
                });
                cmd.exec();
                History.prototype.push(cmd);
                if (obj.textAlign == 'center') {
                    jQuery('#btn_center_align').addClass('selected');
                    jQuery('#btn_right_align').removeClass('selected');
                    jQuery('#btn_left_align').removeClass('selected');
                } else {
                    jQuery('#btn_center_align').removeClass('selected');
                }
            }
        }.bind(this));
        jQuery('#add_btn_shadow_config #shadow_x_range, #shadow_y_range, #shadow_blur').change(function(e, ele) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var x_offset = jQuery('#shadow_x_range').val();
                var y_offset = jQuery('#shadow_y_range').val();
                var blur = jQuery('#shadow_blur').val();
                var shadow_color = jQuery("#text_shadow_color span").css("border-bottom-color");
                var shadow_color1 = new RGBColor(shadow_color);
                var shadow_color2 = shadow_color1.toHex();
                //var shadow_color = jQuery('#text_shadow_color span .colorpicker_hex input').val();
                var shadow = shadow_color2 + ' ' + x_offset + 'px' + ' ' + y_offset + 'px' + ' ' + blur + 'px';
                var cmd = new UpdateCommand(canvas, obj, {
                    shadow: shadow
                });
                cmd.exec();
                History.prototype.push(cmd);
            }
        }.bind(this));
        jQuery('#reset_stroke').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            jQuery("#text_stroke_color span").css('border-color', "black");
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var cmd = new UpdateCommand(canvas, obj, {
                    stroke: '',
                    strokeWidth: '1'
                });
                cmd.exec();
                History.prototype.push(cmd);
                jQuery('#btn_font_effect').each(function(index, val) {
                    jQuery(index.id).removeClass('active');
                });
            }
        }.bind(this));
        jQuery('#stroke_width').on('change input', function() {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var stroke_width = parseFloat(jQuery('#stroke_width').val());
                var stroke_color2 = jQuery("#text_stroke_color span").css("border-bottom-color");
                var stroke_color1 = new RGBColor(stroke_color2);
                var stroke_color = stroke_color1.toHex();
                if (obj.type == 'group' && obj._objects) {
                    var stroke_color = obj._objects[0].stroke ? obj._objects[0].stroke : '#000000';
                }
                //var stroke_color = (obj.stroke != null) ? obj.stroke : '#000000';
                if (obj.strokeWidth != stroke_width) {
                    var cmd = new UpdateCommand(canvas, obj, {
                        stroke: stroke_color,
                        strokeWidth: stroke_width
                    });
                    cmd.exec();
                }
                History.prototype.push(cmd);
            }
        }.bind(this));
        jQuery('#add_btn_stroke').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var elem = e.target || e.srcElement;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                var stroke_color;
                this.toggleTextEffectPopup(elem);
                var stroke_width = jQuery('#stroke_width').val();
                var stroke_color2 = jQuery("#text_stroke_color span").css('border-bottom-color');
                var stroke_color1 = new RGBColor(stroke_color2);
                stroke_color = stroke_color1.toHex();
                if (obj.type == 'group' && obj._objects) {
                    var stroke_width = obj._objects[0].strokeWidth ? obj._objects[0].strokeWidth : jQuery('#stroke_width').val();
                    stroke_color = obj._objects[0].stroke ? obj._objects[0].stroke : '#000000';
                }
                jQuery("#text_stroke_color span").css('border-color', stroke_color);
                if (obj.strokeWidth == '1' && obj.type != 'group') {
                    var cmd = new UpdateCommand(canvas, obj, {
                        stroke: stroke_color,
                        strokeWidth: this.defaultTextOpt.strokeWidth
                    });
                    this.fieldsMap.strokeWidth.value = this.defaultTextOpt.strokeWidth;
                    cmd.exec();
                    History.prototype.push(cmd);
                }
            }
        }.bind(this));
        jQuery('#add_btn_arc').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var elem = e.target || e.srcElement;
            var obj = this.productDesigner.canvas.getActiveObject();
            jQuery('#add_btn_arc_config').css('display', 'none');
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                this.toggleTextEffectPopup(elem);
                /*var arc = $('arc_selection').value;
                 if(obj && obj.tab == 'groupTab'){
                 return false;
                 }
                 var currentArc = parseInt($('arc_selection').value);
                 if(obj && obj.type == 'text' || obj.type == 'group'){
                 var defaultArc = obj.arc ? obj.arc : 0;
                 var cmd = new TextSpaceAngleChange(canvas,
                 {arc : defaultArc},
                 {arc : currentArc});
                 cmd.exec();
                 this.productDesigner.history.push(cmd);
                 }*/
            }
        }.bind(this));
        jQuery('#text_bg_null').on('click', function(e) {
            var canvas = this.productDesigner.canvas;
            var obj = this.productDesigner.canvas.getActiveObject();
            if (obj && (obj.type == 'text' || obj.type == 'group')) {
                // if($('text_bg_null').checked){
                var cmd = new UpdateCommand(canvas, obj, {
                    textBackgroundColor: ''
                });
                cmd.exec();
                History.prototype.push(cmd);
                jQuery('#text_bgcolor_title').html('No Color');
                jQuery('#text_bg_color').children().css("borderColor", '#FFFFFF');
                //new added
                /*jQuery('.text-bgcolor-img').each(function (val, index) {
                 index.parent().removeClassName('selected');
                 });*/
            }
        }.bind(this));
    },
    toggleTextEffectPopup: function(elem) {
        jQuery('.tab-detail').each(function(index, val) {
            jQuery(val).removeClass('selected');
        });
        jQuery(elem).parent().addClass('selected');
        jQuery('.text_effect_popup').each(function(index, val) {
            jQuery('#' + val.id).css('display', 'none');
        });
        jQuery('#' + elem.id + '_config').css('display', 'block');
    },
    updateButtonClass: function(obj, config) {
        if (obj && (obj.type == 'text' || obj.type == 'group')) {
            for (var property in this.buttonsMap) {
                if (this.buttonsMap.hasOwnProperty(property) && this.buttonsMap[property]) {
                    var field = this.buttonsMap[property];
                    for (var k in config) {
                        if (property == k) {
                            if (obj[property] == config[k]) {
                                field.addClass('selected');
                            } else {
                                field.removeClass('selected');
                            }
                        }
                    }
                }
            }
        }
    },
    updateAlignment: function(obj, config) {
        if (obj && obj.type == 'text') {
            for (var property in this.alignment) {
                if (this.alignment.hasOwnProperty(property) && this.alignment[property]) {
                    var field = this.alignment[property];
                    for (var k in config) {
                        if (property == k) {
                            if (obj[property] == config[k]) {
                                jQuery(field).addClass('selected');
                            } else {
                                jQuery(field).removeClass('selected');
                            }
                        }
                    }
                }
            }
        }
    },
    updateTextColor: function(obj, config) {
        if (obj && (obj.type == 'text' || obj.type == 'group')) {
            for (var property in this.textColorMap) {
                if (this.textColorMap.hasOwnProperty(property) && this.textColorMap[property]) {
                    var field = this.textColorMap[property];
                    for (var k in config) {
                        if (property == k) {
                            if (obj[property] == config[k]) {
                                var a = config[k] ? config[k] : '#FFFFFF';
                                field.children().css("bordercolor", a);
                            } else {
                                var a = obj[property] ? '' : '#FFFFFF';
                                field.children().css("bordercolor", a);
                            }
                        }
                    }
                }
            }
        }
    },
    updateLabels: function(obj, params) {
        var font_size = obj.fontSize ? obj.fontSize : jQuery('#font_size_selection').val();
        jQuery('#size_label').html(" (" + font_size + ")");
        jQuery('#font_size_selection').val(font_size);
        if (obj.name == "groupTabName" || obj.name == "groupTabNumber") {
            var group_font_size = obj.fontSize ? obj.fontSize : jQuery('#group_font_size_selection').val();
            jQuery('#group_size_label').html(" (" + group_font_size + ")");
            jQuery('#group_font_size_selection').val(group_font_size);
        }
        if (obj.opacity) {
            var opacity = obj.opacity ? obj.opacity : jQuery('#opacity').val();
            jQuery('#opacity').val(opacity);
            jQuery('#opacity_label').html(" (" + opacity + ")");
        }
        if (obj.shadow) {
            var xoffset = obj.shadow.offsetX ? obj.shadow.offsetX : jQuery('#shadow_x_range').val();
            jQuery('#xoffset_label').html(" (" + xoffset + ")");
            jQuery('#shadow_x_range').val(xoffset);
            var yoffset = obj.shadow.offsetY ? obj.shadow.offsetY : jQuery('#shadow_y_range').val();
            jQuery('#yoffset_label').html(" (" + yoffset + ")");
            jQuery('#shadow_y_range').val(yoffset);
            var blur = obj.shadow.blur ? obj.shadow.blur : jQuery('#shadow_blur').val();
            jQuery('#blur_label').html(" (" + blur + ")");
            jQuery('#shadow_blur').val(blur);
        }
        if (obj.strokeWidth != 1) {
            var width = obj.strokeWidth ? obj.strokeWidth : jQuery('#stroke_width').val();
            jQuery('#stroke_width').val(width);
            if (width != 2) {
                width = parseInt(width.toString().split('.')[1]);
            } else {
                width = 10;
            }
            jQuery('#stroke_width_label').html(" (" + width + ")");
        } else {
            var width = 1;
            jQuery('#stroke_width_label').html(" (" + width + ")");
            jQuery('#stroke_width').val(width);
            var field = jQuery('#text_stroke_color');
            var text_stroke_color = jQuery("#text_stroke_color span").css('border-bottom-color');
            var text_stroke_color1 = new RGBColor(text_stroke_color);
            var text_stroke_color2 = text_stroke_color1.toHex();
            jQuery(field).children().css('bordercolor', text_stroke_color2);
        }
        if (obj.arc != undefined) {
            var arc = obj.arc ? obj.arc : jQuery('#text_arc').val();
            jQuery('#arc_label').html(" (" + arc + ")");
            jQuery('#text_arc').val(arc);
            var width = obj.getObjects()[0].strokeWidth ? obj.getObjects()[0].strokeWidth : jQuery('#stroke_width').val()
            jQuery('#stroke_width').val(width);
            if (width != 1 && width != 2) {
                width = parseInt(width.toString().split('.')[1]);
            } else {
                width = 10;
            }
            jQuery('#stroke_width_label').html(" (" + width + ")");
            var opacity = obj.getObjects()[0].opacity ? obj.getObjects()[0].opacity : jQuery('#opacity').val()
            jQuery('#opacity_label').html(" (" + opacity + ")");
            jQuery('#opacity').val(opacity);
            var font_size = obj.getObjects()[0].fontSize ? obj.getObjects()[0].fontSize : jQuery('#font_size_selection').val()
            jQuery('#size_label').html("(" + font_size + ")");
            jQuery('#font_size_selection').val(font_size);
            if (obj.getObjects()[0].shadow != null) {
                var xoffset = obj.getObjects()[0].shadow.offsetX ? obj.getObjects()[0].shadow.offsetX : jQuery('#shadow_x_range').val()
                jQuery('#xoffset_label').html("(" + xoffset + ")")
                jQuery('#shadow_x_range').val(xoffset);
                var yoffset = obj.getObjects()[0].shadow.offsetY ? obj.getObjects()[0].shadow.offsetY : jQuery('#shadow_y_range').val()
                jQuery('#yoffset_label').html("(" + yoffset + ")")
                jQuery('#shadow_y_range').val(yoffset);
                var blur = obj.getObjects()[0].shadow.blur ? obj.getObjects()[0].shadow.blur : jQuery('#shadow_blur').val()
                jQuery('#blur_label').html("(" + blur + ")")
                jQuery('#shadow_blur').val(blur);
            }
        }
        if (obj.spacing != undefined) {
            var spacing = obj.spacing ? obj.spacing : jQuery('#text_spacing').val();
            jQuery('#spacing_label').html(" (" + spacing + ")");
            jQuery('#text_spacing').val(spacing);
        }
    },
    _setInputValues: function(textObj) {
        var newText = '';
        var typeObj = textObj != null ? textObj.type : '';
        var finalObj = textObj;
        if (typeObj == 'group') {
            for (var i = 0; i < textObj.getObjects().length; i++) {
                var finalObj = textObj.getObjects()[i];
                break;
            }
        }
        for (var property in this.fieldsMap) {
            if (this.fieldsMap.hasOwnProperty(property) && this.fieldsMap[property]) {
                var field = this.fieldsMap[property];
                /*for arc */
                if (typeObj == 'group') {
                    if (property == "text") {
                        for (var i = 0; i < textObj.getObjects().length; i++) {
                            var newObj = textObj.getObjects()[i];
                            if (newObj.type == 'text') {
                                newText = newText + newObj.getText();
                            }
                        }
                        jQuery(field).val(newText);
                    } else {
                        var a = finalObj ? finalObj[property] : this.defaultTextOpt[property];
                        jQuery(field).val(a);
                    }
                } else {
                    if (property == 'textShadowOffsetX') {
                        if (textObj.shadow) {
                            jQuery(field).val(textObj ? textObj.shadow.offsetX : this.defaultTextOpt[property]);
                        }
                    } else if (property == 'textShadowOffsetY') {
                        if (textObj.shadow) {
                            jQuery(field).val(textObj ? textObj.shadow.offsetY : this.defaultTextOpt[property]);
                        }
                    } else if (property == 'textShadowBlur') {
                        if (textObj.shadow) {
                            jQuery(field).val(textObj ? textObj.shadow.blur : this.defaultTextOpt[property]);
                        }
                    } else {
                        if (property != 'text' && property != 'text2') {
                            jQuery(field).val(textObj ? textObj[property] : this.defaultTextOpt[property]);
                        }
                    }
                }
                jQuery('#text_prop_container').removeClass('disabled');
                /*ends*/
            }
        }
        for (var property in this.buttonsMap) {
            if (this.buttonsMap.hasOwnProperty(property) && this.buttonsMap[property]) {
                var field = this.buttonsMap[property];
                if (textObj) {
                    if (jQuery(field)[0] == jQuery('#add_btn_bold')[0]) {
                        if (textObj[property] == "bold") {
                            jQuery(field).addClass('selected');
                        } else {
                            jQuery(field).removeClass('selected');
                        }
                    }
                    if (jQuery(field)[0] == jQuery('#add_btn_italic')[0]) {
                        if (textObj[property] == "italic") {
                            jQuery(field).addClass('selected');
                        } else {
                            jQuery(field).removeClass('selected');
                        }
                    }
                    if (jQuery(field)[0] == jQuery('#add_btn_underline')[0]) {
                        if (textObj[property] == "underline") {
                            jQuery(field).addClass('selected');
                        } else {
                            jQuery(field).removeClass('selected');
                        }
                    }
                }
            }
        }
        for (var property in this.alignment) {
            if (this.alignment.hasOwnProperty(property) && this.alignment[property]) {
                var field = this.alignment[property];
                if (textObj) {
                    if (jQuery(field)[0] == jQuery('#btn_left_align')[0]) {
                        if (textObj.textAlign == "left") {
                            jQuery(field).addClass('selected');
                        } else {
                            jQuery(field).removeClass('selected');
                        }
                    }
                    if (jQuery(field)[0] == jQuery('#btn_center_align')[0]) {
                        if (textObj.textAlign == "center") {
                            jQuery(field).addClass('selected');
                        } else {
                            jQuery(field).removeClass('selected');
                        }
                    }
                    if (jQuery(field)[0] == jQuery('#btn_right_align')[0]) {
                        if (textObj.textAlign == "right") {
                            jQuery(field).addClass('selected');
                        } else {
                            jQuery(field).removeClass('selected');
                        }
                    }
                }
            }
        }
        for (var property in this.textColorMap) {
            if (this.textColorMap.hasOwnProperty(property) && this.textColorMap[property]) {
                var field = this.textColorMap[property];
                if (textObj) {
                    if (field[0] == jQuery('#text_color')[0]) {
                        if (finalObj[property] == finalObj.fill) {
                            var color = finalObj.fill ? finalObj.fill : '#FFFFFF'
                            jQuery(field).children().css('borderColor', color);
                        } else {
                            jQuery(field).children().css('borderColor', finalObj[property]);
                        }
                    }
                    if (field[0] == jQuery('#text_bg_color')[0]) {
                        if (finalObj[property] == finalObj.textBackgroundColor) {
                            var color = finalObj.textBackgroundColor ? finalObj.textBackgroundColor : '#FFFFFF';
                            jQuery(field).children().css('borderColor', color);
                        } else {
                            jQuery(field).children().css('borderColor', finalObj[property]);
                        }
                    }
                }
            }
        }
    },
};
var LayersManager = function() {
    jQuery(document).on('ObjSelect', function(e) {
        var obj = e.originalEvent.obj;
        self.active = obj.get('obj_id');
        if ((obj.type == 'image') || (obj.type == 'path-group') || (obj.type == 'path')) {
            jQuery('.nav_tab').each(function(index, val) {
                jQuery(val).removeClass('resp-tab-active');
                jQuery(val).css('background-color', '');
            });
            jQuery('.tab-detail').each(function(index, val) {
                jQuery(val).removeClass('selected');
            });
            jQuery('.desgin-detail').each(function(index, val) {
                jQuery(val).css('display', 'none');
                jQuery(val).removeClass('resp-tab-content-active');
            });
            jQuery('.inner-tab-option').each(function(index, val) {
                jQuery(val).css('display', 'none');
            });
            jQuery('#inner-tab-option-clipart').addClass('resp-tab-content-active');
            //$('shape_arts_btn').up().removeClassName('selected');
            jQuery('#add_upload_image').parent().removeClass('selected');
            jQuery('#shape_arts_btn').parent().addClass('selected');
            jQuery('#shape_arts').css('display', 'block');
            jQuery('#clipart_tab').addClass('resp-tab-active');
            //jQuery('#clipart_tab').css('background-color', 'white');
            jQuery('#inner-tab-option-clipart').css('display', 'block');
        }
        /* for arc */
        //else if ((obj.type == 'text' || obj.type == 'group')) {
        else if (obj.type == 'text' || obj.type == 'group') {
            jQuery('.nav_tab').each(function(index, val) {
                jQuery(val).removeClass('resp-tab-active');
                jQuery(val).css('background-color', '');
            });
            if (!obj.arcOn) {
                jQuery('.tab-detail').each(function(index, val) {
                    jQuery(val).removeClass('selected');
                });
                jQuery('.text_effect_popup').each(function(index, val) {
                    jQuery('#' + val.id).css('display', 'none');
                });
                jQuery('#add_btn_shadow').parent().addClass('selected');
                //jQuery('#add_btn_shadow_config').css("display", "block");
                jQuery('.desgin-detail').each(function(index, val) {
                    jQuery(val).css('display', 'none');
                    jQuery(val).removeClass('resp-tab-content-active');
                });
            } else {
                jQuery('.desgin-detail').each(function(index, val) {
                    jQuery(val).css('display', 'none');
                    jQuery(val).removeClass('resp-tab-content-active');
                });
            }
            jQuery('.inner-tab-option').each(function(index, val) {
                jQuery(val).css('display', 'none');
            });
            if ((obj.type == 'text' || obj.type == 'group')) {
                if (obj.tab == 'grouporder') {
                    jQuery('#text_prop_container').addClass('disabled');
                    jQuery('.inner-tab-option').each(function(index, val) {
                        jQuery(val).css('display', 'none');
                    });
                    jQuery('.desgin-detail').each(function(index, val) {
                        jQuery(val).css('display', 'none');
                        jQuery(val).removeClass('resp-tab-content-active');
                    });
                    jQuery('#add_name_num_content').addClass('resp-tab-content-active');
                    jQuery('#add_name_num_content').css('display', 'block');
                    jQuery('#grouporder_tab').addClass('resp-tab-active');
                    //jQuery('#grouporder_tab').css('background-color', 'white');
                } else {
                    jQuery('#inner-tab-option-text').addClass('resp-tab-content-active');
                    //$('choose_quotes_btn').up().removeClassName('selected');
                    // $('add_text_btn').up().addClassName('selected');
                    jQuery('#add_text').css('display', 'block');
                    jQuery('#text_tab').addClass('resp-tab-active');
                    //jQuery('#text_tab').css('background-color', 'white');
                    jQuery('#inner-tab-option-text').css('display', 'block');
                    TextDesigner._setInputValues(obj);
                    if (jQuery('#add_btn_stroke_config').css('display') == 'block') {
                        jQuery(jQuery('.tab-detail')[1]).addClass('selected')
                    } else {
                        jQuery(jQuery('.tab-detail')[0]).addClass('selected')
                    }
                }
            }
        }
    }.bind(this));
}
LayersManager.prototype = {
    active: null,
    layers: {},
    outside: {},
    initialize: function() {
        this.observLayerOnSelect();
        this.observLayerButton();
    },
    observLayerButton: function() {
        jQuery('#btn_layers').on('click', function(e) {
            jQuery('#layers_manager').toggle();
        });
    },
    observLayerOnSelect: function() {
        jQuery('#layers_manager').click(function(e, elm) {
            var layerElement = e.target || e.srcElement;
            var action = decodeURIComponent(layerElement.getAttribute('id'));
            var layer_obj_id = decodeURIComponent(layerElement.getAttribute('layer-obj'));
            var design_area_id = decodeURIComponent(layerElement.getAttribute('design-area-id'));
            if (action == 'layer') {
                this.setLayer(layer_obj_id, design_area_id);
            }
            if (action == 'lock') {
                this.LockLayer(layer_obj_id, layerElement, design_area_id);
            }
            if (action == 'delete') {
                this.removeLayer(layer_obj_id, design_area_id);
            }
            if (action == 'front') {
                this.loadInFront(layer_obj_id, design_area_id);
            }
            if (action == 'back') {
                this.loadInBack(layer_obj_id, design_area_id);
            }
        }.bind(this));
    },
    LockLayer: function(obj_id, layerElement, design_area_id) {
        this.productDesigner = ProductDesigner.prototype;
        var layer_obj = {};
        for (var index in ProductDesigner.prototype.ImageSideObject) {
            var index2 = index.split("_");
            if ('id_' + index2[2] == obj_id) {
                layer_obj = ProductDesigner.prototype.ImageSideObject[index];
            }
        }
        if (layer_obj.selectable == true) {
            var cmd = new LockCanvasObject(this.productDesigner, layer_obj, layerElement);
            cmd.exec();
            History.prototype.push(cmd);
        } else {
            // layer_obj.selectable = true;
            // layer_obj.hasControls = true;
            var cmd = new UnLockCanvasObject(this.productDesigner, layer_obj, layerElement);
            cmd.exec();
            History.prototype.push(cmd);
        }
    },
    removeLayer: function(obj_id, design_area_id) {
        this.productDesigner = ProductDesigner.prototype;
        var layer_obj = {};
        for (var index in ProductDesigner.prototype.ImageSideObject) {
            var index2 = index.split("_");
            if ('id_' + index2[2] == obj_id) {
                layer_obj = ProductDesigner.prototype.ImageSideObject[index];
            }
        }
        var cmd = new RemoveCanvasObject(this.productDesigner, layer_obj, design_area_id);
        cmd.exec();
        History.prototype.push(cmd);
    },
    loadInFront: function(obj_id, design_area_id) {
        this.productDesigner = ProductDesigner.prototype;
        var layer_obj = {};
        for (var index in ProductDesigner.prototype.ImageSideObject) {
            var index2 = index.split("_");
            if ('id_' + index2[2] == obj_id) {
                layer_obj = ProductDesigner.prototype.ImageSideObject[index];
            }
        }
        var cmd = new BringFrontCommand(canvas, layer_obj, design_area_id);
        cmd.exec();
        History.prototype.push(cmd);
    },
    loadInBack: function(obj_id, design_area_id) {
        this.productDesigner = ProductDesigner.prototype;
        var layer_obj_back = {};
        for (var index in ProductDesigner.prototype.ImageSideObject) {
            var index2 = index.split("_");
            if ('id_' + index2[2] == obj_id) {
                layer_obj_back = ProductDesigner.prototype.ImageSideObject[index];
            }
        }
        var cmd = new SendBackCommand(this.productDesigner, layer_obj_back, design_area_id);
        cmd.exec();
        History.prototype.push(cmd);
    },
    add: function(obj, image_id, object_id) {
        if (obj.designarea_id != undefined) {
            obj.set({
                image_id: image_id ? image_id : ProductDesigner.prototype.currentProduct,
                designarea_id: obj.designarea_id,
                image_side: ProductDesigner.prototype.currentImageSide,
                //image_side_area: ProductDesigner.currentImageSideArea[obj.designarea_id],
            });
        } else {
            obj.set({
                image_id: image_id ? image_id : ProductDesigner.prototype.currentProduct,
                designarea_id: ProductDesigner.prototype.currentDesignArea,
                image_side: ProductDesigner.prototype.currentImageSide,
                //image_side_area: ProductDesigner.currentImageSideArea[ProductDesigner.currentDesignArea],
            });
        }
        if (!obj.get('obj_id') && !object_id) {
            obj.set('obj_id', 'id_' + Date.now());
        } else if (object_id) {
            obj.set('obj_id', object_id);
        }
        LayersManager.prototype.active = obj.get('obj_id');
        LayersManager.prototype.layers[LayersManager.prototype.active] = obj;
    },
    setLayer: function(obj_id, design_area_id) {
        this.productDesigner = ProductDesigner.prototype;
        if (design_area_id == null) {
            var canvas = this.productDesigner.canvas;
        } else {
            for (var index in this.productDesigner.containerCanvases) {
                var index1 = index.split("&");
                if (design_area_id == index1[1]) {
                    var canvas = this.productDesigner.containerCanvases[index];
                }
            }
        }
        var layer_obj = {};
        canvas.getObjects().each(function(obj) {
            if (obj.obj_id == obj_id) {
                layer_obj = obj;
            }
        }.bind(this));
        canvas.setActiveObject(layer_obj);
        canvas.renderAll();
        this.active = layer_obj.get('obj_id');
        this.layers[this.active] = layer_obj;
    },
    removeOutsideMark: function(id) {
        if (!LayersManager.prototype.outside[id]) return;
        LayersManager.prototype.outside[id] = false;
    },
    removeOnlyLayer: function(obj) {
        if (!obj) {
            return;
        }
        var id = obj.get('obj_id');
        LayersManager.prototype.layers[id] = null;
    }
};
var RemoveCanvasObject = function(designerWindow, obj, design_area_id, change_side, canvas, groupFlag) {
    if (!canvas) var canvas = designerWindow.canvas;
    if ((design_area_id == undefined) || (design_area_id == "null")) {
        var canvas = designerWindow.canvas;
    } else {
        for (var index in designerWindow.containerCanvases) {
            var index1 = index.split("&");
            if (index1[1] == design_area_id) {
                var canvas = designerWindow.containerCanvases[index];
            }
        }
    }
    return {
        exec: function() {
            if (obj && obj != null) {
                LayersManager.prototype.removeOutsideMark(obj.get('obj_id'));
                LayersManager.prototype.removeOnlyLayer(obj);
            }
            if (obj && obj.group_type != undefined) {
                if (obj.group_type == 'name') {
                    ProductDesigner.prototype.nameAdd = false;
                    if (!change_side) {
                        jQuery('#isname').prop('checked', false);
                        var items = document.getElementsByClassName('group-name');
                    }
                } else {
                    ProductDesigner.prototype.numberAdd = false;
                    if (!change_side) {
                        jQuery('#isnumber').prop('checked', false);
                        var items = document.getElementsByClassName('group-number');
                    }
                }
                if (!change_side) {
                    for (var i = 0; i < items.length; i++) {
                        jQuery(items[i]).attr('disabled', 'disabled');
                        jQuery(items[i]).val('');
                    }
                    obj.set({
                        mydesign: true
                    });
                }
            }
            for (var index in ProductDesigner.prototype.containerCanvases) {
                var canvas = ProductDesigner.prototype.containerCanvases[index];
                canvas.remove(obj);
            }
            //Remove layer from object
            if (obj) {
                var layer_ul = jQuery("#layers_ul");
                if (jQuery(obj.get('obj_id'))) {
                    jQuery('#' + obj.get('obj_id')).remove();
                }
                //Remove layer from object
                ProductDesigner.prototype.reloadPrice();
                for (var index in designerWindow.ImageSideObject) {
                    var index1 = index.split("_");
                    if ('id_' + index1[2] == obj.get('obj_id')) {
                        delete designerWindow.ImageSideObject[index];
                    }
                }
            }
            if (!groupFlag) {
                var flag = false;
                var allObj = canvas.getObjects();
                for (var i = 0; i < allObj.length; i++) {
                    if (allObj[i].tab == 'grouporder') {
                        flag = true;
                    }
                }
                if (flag == false && !ProductDesigner.prototype.nameAdd && !ProductDesigner.prototype.numberAdd && obj.tab == 'grouporder') {
                    deleteAllRow();
                    jQuery('#group_side_label').hide();
                    GroupDesigner.prototype.groupSide = null;
                    jQuery('#group_font_properties').addClass('disabled');
                }
            }
            //designerWindow.toggleImageSelectedClass(obj, 'remove');
            //delete designerWindow.ImageSideObject[obj.image_side + '_' + obj.get('obj_id') + '_' + obj.designarea_id];
            //delete designerWindow.ImageSideObject[ProductDesigner.currentImageSide+'_'+obj.get('obj_id')+'_'+ProductDesigner.currentDesignArea];
        },
        unexec: function() {
            if (obj.group_type != undefined) {
                if (obj.group_type == 'name') {
                    ProductDesigner.prototype.nameAdd = true;
                } else {
                    ProductDesigner.prototype.numberAdd = true;
                }
            }
            ProductDesigner.prototype.canvas.add(obj);
            //Add layer From Object
            var layer_ul = jQuery("#layers_ul");
            var layer_li = document.createElement('li');
            layer_li.setAttribute('id', obj.get('obj_id'));
            layer_ul.append(layer_li);
            var layer_span_layer = document.createElement('span');
            layer_span_layer.setAttribute('id', 'layer');
            layer_span_layer.setAttribute('class', 'layer');
            layer_span_layer.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_layer.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            if (obj.type == 'text' || obj.type == 'group') {
                var layer_img = document.createElement('span');
                var layerText = obj.text;
                // layer_img.innerHTML = layerText.substr(0,6);
                layer_img.setAttribute('layer-obj', obj.get('obj_id'));
                layer_img.setAttribute('class', 'sprite ico-layer-text');
                layer_span_layer.appendChild(layer_img);
            } else if (obj.type == 'path' || obj.type == 'path-group') {
                var layer_img = document.createElement('span');
                var layerText = obj.text;
                // layer_img.innerHTML = layerText.substr(0,6);
                layer_img.setAttribute('layer-obj', obj.get('obj_id'));
                layer_img.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
                layer_img.setAttribute('class', 'sprite ico-layer-path');
                layer_span_layer.appendChild(layer_img);
            } else {
                var layer_img = document.createElement('img');
                if (obj.src.search('http') != -1) {
                    layer_img.setAttribute('src', obj.src);
                } else {
                    layer_img.setAttribute('src', ProductDesigner.prototype.mediaUrl + obj.src);
                }
                layer_img.setAttribute('layer-obj', obj.get('obj_id'));
                layer_img.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
                layer_img.setAttribute('id', 'layer');
                layer_img.setAttribute('class', 'layer');
                layer_span_layer.appendChild(layer_img);
            }
            layer_li.appendChild(layer_span_layer);
            var layer_span_action = document.createElement('span');
            layer_span_action.setAttribute('class', 'sprite ico-lock');
            layer_span_action.setAttribute('id', 'lock');
            layer_span_action.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_action.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_action.innerHTML = 'Lock';
            layer_li.appendChild(layer_span_action);
            var layer_span_front = document.createElement('span');
            layer_span_front.setAttribute('class', 'sprite ico-front');
            layer_span_front.setAttribute('id', 'front');
            layer_span_front.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_front.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_front.innerHTML = 'Bring Forward';
            layer_li.appendChild(layer_span_front);
            var layer_span_back = document.createElement('span');
            layer_span_back.setAttribute('class', 'sprite ico-back');
            layer_span_back.setAttribute('id', 'back');
            layer_span_back.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_back.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_back.innerHTML = 'Bring Forward';
            layer_li.appendChild(layer_span_back);
            var layer_span_delete = document.createElement('span');
            layer_span_delete.setAttribute('id', 'delete');
            layer_span_delete.setAttribute('class', 'sprite ico-delete');
            layer_span_delete.setAttribute('layer-obj', obj.get('obj_id'));
            layer_span_delete.setAttribute('design-area-id', ProductDesigner.prototype.currentDesignAreaId);
            layer_span_delete.innerHTML = 'Delete';
            layer_li.appendChild(layer_span_delete);
            // Add layer in object
            canvas.setActiveObject(obj);
            obj.setCoords();
            canvas.renderAll();
            ProductDesigner.prototype.reloadPrice();
            designerWindow.toggleImageSelectedClass(obj, 'add');
        }
    }
};
var checkFunction = function(str) {
    str += '';
    var first_char = str.charAt(0).toUpperCase();
    return first_char + str.substr(1);
};
var UpdateCommand = function(canvas, obj, params, alignByCenter) {
    var prop = {};
    var self = this;
    for (var k in params) {
        if (params.hasOwnProperty(k)) {
            prop[k] = obj[k];
        }
    }
    var update = function(obj, config) {
        for (var k in config) {
            if (!params.hasOwnProperty(k)) {
                continue;
            }
            if (typeof obj['set' + checkFunction(k)] == 'function') {
                obj['set' + checkFunction(k)](config[k]);
            } else {
                obj[k] = config[k];
            }
        }
    };
    return {
        type: 'update',
        prop: params,
        exec: function() {
            /* for arc text */
            if (obj.type == 'group') {
                for (var i = 0; i < obj.getObjects().length; i++) {
                    if (obj.getObjects()[i].type == 'text') {
                        var newObj = obj.getObjects()[i];
                        update(newObj, params);
                    }
                }
            } else {
                update(obj, params);
            }
            /* ends */
            canvas.renderAll();
            if (obj.type == 'text' || obj.type == 'group') {
                TextDesigner.updateButtonClass(obj, params);
                TextDesigner.updateAlignment(obj, params);
                TextDesigner.updateTextColor(obj, params);
                TextDesigner.updateLabels(obj, params);
                //if (obj.tab == 'text' && alignByCenter != undefined) {
                if (obj.tab == 'text' && alignByCenter != undefined) {
                    obj.centerH();
                } else {
                    if (alignByCenter) {
                        if (obj.tab == 'grouporder') {
                            obj.centerH();
                        } else {
                            //obj.center();
                        }
                    };
                }
            }
        },
        unexec: function() {
            /* for arc text */
            var allObj = canvas.getObjects();
            for (var i = 0; i < allObj.length; i++) {
                if (obj.obj_id == allObj[i].obj_id) {
                    obj = allObj[i];
                }
            }
            if (obj.type == 'group') {
                for (var i = 0; i < obj.getObjects().length; i++) {
                    if (obj.getObjects()[i].type == 'text') {
                        var newObj = obj.getObjects()[i];
                        update(newObj, prop);
                    }
                }
            } else {
                update(obj, prop);
            }
            canvas.renderAll();
            if (obj.type == 'text' || obj.type == 'group') {
                TextDesigner.updateButtonClass(obj, params);
                TextDesigner.updateAlignment(obj, params);
                TextDesigner.updateTextColor(obj, params);
                TextDesigner.updateLabels(obj, params);
            }
            /*ends*/
        }
    };
};
var AlignToCenter = function(canvas, obj) {
    // save original state
    var prop = {
        left: obj.left,
        top: obj.top
    };
    return {
        exec: function() {
            obj.center();
            obj.setCoords();
            //canvas.setActiveObject(obj);
            canvas.renderAll();
        },
        unexec: function() {
            obj.setLeft(prop.left);
            obj.setTop(prop.top);
            obj.setCoords();
            //canvas.setActiveObject(obj);
            canvas.renderAll();
        }
    };
};
var History = function() {};
History.prototype = {
    undoStack: new Array(),
    redoStack: new Array(),
    push: function(cmd) {
        History.prototype.undoStack.push(cmd);
        this.historyChangeEvent();
    },
    undo: function() {
        var cmd = History.prototype.undoStack.pop();
        if (!cmd) return;
        cmd.unexec();
        History.prototype.redoStack.push(cmd);
        this.historyChangeEvent();
    },
    redo: function() {
        var cmd = History.prototype.redoStack.pop();
        if (!cmd) return;
        cmd.exec();
        History.prototype.undoStack.push(cmd);
        this.historyChangeEvent();
    },
    clear: function() {
        History.prototype.undoStack = new Array();
        History.prototype.redoStack = new Array();
    },
    last: function() {
        var stack = History.prototype.undoStack;
        return stack[stack.length - 1];
    },
    historyChangeEvent: function() {
        var event = document.createEvent('Event');
        event.history = this;
        event.initEvent('changeHistoryEvent', true, true);
        document.dispatchEvent(event);
    }
};

function getUrlParams() {
    var paramString = window.location.search.substr(1);
    if (isEmpty(paramString)) {
        var url = location.href;
        UrlArray = url.split("/");
        var params = {};
        for (var j = 0; j < UrlArray.length; j++) {
            if (UrlArray[j] == 'id') {
                params[UrlArray[j]] = UrlArray[j + 1];
            }
            if (UrlArray[j] == 'design') {
                params[UrlArray[j]] = UrlArray[j + 1];
            }
        }
        return params;
    } else {
        var paramArray = paramString.split("&");
        var params = {};
        for (var i = 0; i < paramArray.length; i++) {
            var tmpArray = paramArray[i].split("=");
            params[tmpArray[0]] = tmpArray[1];
        }
        return params;
    }
}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
}

function facebook_share(product_id, design_id) {
    if (jQuery('#product-images-loader')) {
        jQuery('#pd_loading_img').show();
        //jQuery('#product-images-loader').csd("display='block";
    }
    var data = {};
    data.product_id = product_id;
    data.design_id = design_id;
    jQuery.ajax({
        cache: false,
        method: 'post',
        data: {
            data: data
        },
        url: ProductDesigner.prototype.facebookUrl,
        crossDomain: true,
        success: function(data) {
            var response = JSON.parse(data);
            jQuery('#pd_loading_img').hide();
            var image_logo = response.p_logo;
            var product_name = response.p_name;
            var product_url = response.p_url;
            FB.ui({
                method: 'feed',
                name: product_name,
                picture: image_logo,
            }, function(response2) {
                if (response2 && response2.post_id) {}
            });
        }
    });
}

function distinctVal(arr) {
    var newArray = [];
    for (var i = 0, j = arr.length; i < j; i++) {
        if (newArray.indexOf(arr[i]) == -1) newArray.push(arr[i]);
    }
    return newArray;
}

function google_share(product_id, design_id) {
    if (jQuery('#product-images-loader')) {
        jQuery('#pd_loading_img').show();
        //jQuery('#product-images-loader').csd("display='block";
    }
    var data = {};
    data.product_id = product_id;
    data.design_id = design_id;
    jQuery.ajax({
        cache: false,
        method: 'post',
        data: {
            data: data
        },
        url: ProductDesigner.prototype.facebookUrl,
        crossDomain: true,
        success: function(data) {
            var response = JSON.parse(data);
            jQuery('#pd_loading_img').hide();
            var image_logo = response.p_logo;
            var product_name = response.p_name;
            var product_url = response.p_url;
            var go = "https://plus.google.com/share?";
            var title = "title=" + encodeURIComponent(product_name);
            var url = "url=" + encodeURIComponent(product_url);
            var images = "image=" + encodeURIComponent(image_logo);
            window.open(go + url + "&" + title + "&" + images);
        }
    });
}

function displayRecordsClipart(lim, off) {
    var data = {};
    data['limit'] = lim;
    data['clipart_category_id'] = jQuery('#clipart_categories').val();
    jQuery.ajax({
        type: "GET",
        // async: false,
        url: Clipartdesigner.prototype.filterImageUrl,
        data: data,
        // cache: false,
        success: function(data, textStatus, jqXHR) {
            var response = JSON.parse(data);
            var currentlength = jQuery("#image_list").children().length;
            if (response.status == 'success') {
                jQuery('#clipart_images_container').html(response.images);
                ProductDesigner.prototype.clipartcount = jQuery("#image_list").children().length;
                // Clipartdesigner.prototype.observeImageSelect();
                jQuery('#clipart_list_loader').hide();
                //jQuery('#more_clipart').attr("style", "display:block");
                if (jQuery("#image_list").children().length == currentlength || jQuery("#image_list").children().length >= currentlength) {
                    jQuery('#more_clipart').attr("style", "display:none");
                    jQuery('.no_more_cliparts').show();
                } else {
                    jQuery('#more_clipart').attr("style", "display:block");
                }
            }
        }
    });
}
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        if (Math.abs(window.orientation) === 90) {
            // Landscape
        } else {
            // Portrait
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        }
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};