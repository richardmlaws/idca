define([
    'jquery',
    'AjaxproLoader',
    'jquery/ui'
], function($, loader) {
    "use strict";

    $.widget('swissup.ajaxcianDataPost', {

        options: {
            processStart: null,
            processStop: null,
            bind: true,
            attributeName: 'post-ajax',
            formKeyInputSelector: 'input[name="form_key"]'
         },
        _create: function() {
            if (this.options.bind) {
                this._bind();
                loader.setLoaderImage(this.options.loaderImage)
                    .setloaderImageMaxWidth(this.options.loaderImageMaxWidth);
            }
        },

        _bind: function() {
            var self = this, dataPost = this.element.attr('data-post');
            if (!dataPost) {
                return;
            }

            // $(document).undelegate('a[data-post]', 'click.dataPost0');
            this.element
                .attr('data-' + this.options.attributeName, dataPost)
                .removeAttr('data-post');

            this.element.on('click', function(e) {
                e.preventDefault();
                $.proxy(self._ajax, self, $(this))();
            });
        },

        _ajax: function(element) {
            var self = this;

            var dataPost = element.data(this.options.attributeName);
            var parameters = dataPost.data;

            var formKey = $(this.options.formKeyInputSelector).val();
            parameters.form_key = formKey;

            var url = dataPost.action;
            $.ajax({
                method: 'POST',
                url: url,
                dataType: 'json',
                data: parameters,
                beforeSend: function() {
                    element.css({'color': 'transparent'});
                    loader.startLoader(element);
                },
                success: function(res) {
                    element.css({'color': ''});
                    loader.stopLoader(element);
                    if (res.backUrl) {
                        window.location = res.backUrl;
                        return;
                    }
                }
            })
            .fail(function (jqXHR) {
                throw new Error(jqXHR);
            })
            .done(function () {
                // console.log(arguments);
            })
            ;
        }
    });

    return $.swissup.ajaxcianDataPost;
});