<template>
    <tinymce-editor api-key="API_KEY" :init="editorSetting"></tinymce-editor>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
export default {
    name: 'CustomToolbar',
    data() {
        return {
            editorSetting: {
                toolbar: 'customInsertButton customDateButton',
                setup: function (editor) {

                    editor.ui.registry.addButton('customInsertButton', {
                        text: 'My Button',
                        onAction: function (_) {
                            editor.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
                        }
                    });

                    var toTimeHtml = function (date) {
                        return '<time datetime="' + date.toString() + '">' + date.toDateString() + '</time>';
                    };

                    editor.ui.registry.addButton('customDateButton', {
                        icon: 'insert-time',
                        tooltip: 'Insert Current Date',
                        disabled: true,
                        onAction: function (_) {
                            editor.insertContent(toTimeHtml(new Date()));
                        },
                        onSetup: function (buttonApi) {
                            var editorEventCallback = function (eventApi) {
                                buttonApi.setDisabled(eventApi.element.nodeName.toLowerCase() === 'time');
                            };
                            editor.on('NodeChange', editorEventCallback);

                            /* onSetup should always return the unbind handlers */
                            return function (buttonApi) {
                                editor.off('NodeChange', editorEventCallback);
                            };
                        }
                    });
                }
            }
        }
    },
    methods: {

    },
    components: {
        'tinymce-editor': Editor
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
</style>