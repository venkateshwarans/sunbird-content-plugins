/**
 * 
 * plugin to add utilities to other plugins
 * @class Utils
 * @extends org.ekstep.contenteditor.basePlugin
 *
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 * @listens copy:copyItem
 * @listens copy:copyItem
 * @listens reorder:sendtofront
 * @listens reorder:sendtoback
 * @listens delete:invoke
 * @listens object:selected
 * @listens object:unselected
 * 
 */
org.ekstep.contenteditor.basePlugin.extend({
    type: "utils",
    picker: undefined,
    /**
     *   @member clipboard {Object}  
     *   @memberof Utils
     *   
     */
    clipboard: undefined,
    initialize: function() {
        var instance = this;

        ecEditor.addEventListener("reorder:sendtofront", this.sendToFront, this);
        ecEditor.addEventListener("reorder:sendtoback", this.sendToBack, this);
        ecEditor.addEventListener('copy:copyItem', this.copyItem, this);
        ecEditor.addEventListener('paste:pasteItem', this.pasteItem, this);
        ecEditor.addEventListener("delete:invoke", this.deleteObject, this);
        ecEditor.addEventListener("object:selected", this.objectSelected, this);
        ecEditor.addEventListener("object:unselected", this.objectUnSelected, this);

        ecEditor.registerKeyboardCommand('mod+c', function() {
            instance.copyItem();
        });
        ecEditor.registerKeyboardCommand('mod+v', function() {
            instance.pasteItem();
        });
        ecEditor.registerKeyboardCommand(['del', 'backspace'], function() {
            console.log("Delete or backspace key pressed");
            instance.deleteObject();
        });
    },
    /**
     *
     *   send the object to one step front in the canvas
     *   fires the object:modified event to update stage and renders
     *   @memberof Utils
     */
    sendToFront: function(event, data) {
        ecEditor.getCanvas().bringForward(ecEditor.getEditorObject());        
        ecEditor.render();        
        ecEditor.dispatchEvent('object:modified', {id: ecEditor.getEditorObject().id});
    },
    /**
     *
     *   send the object to one step back in the canvas
     *   fires the object:modified event to update stage and renders
     *   @memberof Utils
     */
    sendToBack: function(event, data) {
        ecEditor.getCanvas().sendBackwards(ecEditor.getEditorObject());        
        ecEditor.render();
        ecEditor.dispatchEvent('object:modified', {id: ecEditor.getEditorObject().id});
    },
    /**
     *
     *   get current active plugin instance from stage to copy
     *   update context menu to show paste icon
     *   @memberof Utils
     */
    copyItem: function() {
        this.clipboard = ecEditor.getCurrentObject() ? ecEditor.getCurrentObject() : ecEditor.getCurrentGroup();
        if(this.clipboard) {
            ecEditor.updateContextMenu({ id: 'paste', state: 'SHOW', data: {} });
        }
    },
    /**
     *
     *   get copied plugin instance from clipboard and instantiate.
     *   update context menu to hide paste icon
     *   @memberof Utils
     */
    pasteItem: function() {
        if(this.clipboard) {
            if (_.isArray(this.clipboard)) {
                ecEditor.getCanvas().discardActiveGroup();
                this.clipboard.forEach(function(instance){
                    ecEditor.cloneInstance(instance);
                });
            }
            else ecEditor.cloneInstance(this.clipboard);
            this.clipboard = undefined;
            ecEditor.updateContextMenu({ id: 'paste', state: 'HIDE', data: {} });
        }
    },
    /**
     *
     *   deletes the object or group from the canvas 
     *   invokes remove method
     *   @memberof Utils
     */
    deleteObject: function(event, data) {
        var activeGroup = ecEditor.getEditorGroup(), activeObject = ecEditor.getEditorObject(), id, instance = this;

        if (activeObject) {
            instance.remove(activeObject);
        } else if (activeGroup) {
            ecEditor.getCanvas().discardActiveGroup();
            activeGroup.getObjects().forEach(function(object) {
                instance.remove(object);
            });
        }
    },
    /**
     *
     *   it is invoked on object delete
     *   @memberof Utils
     */
    remove: function(object) {
        ecEditor.dispatchEvent('delete:invoked', { 'editorObj': ecEditor.getPluginInstance(object.id).attributes });
        ecEditor.getCanvas().remove(object);
        ecEditor.dispatchEvent('stage:modified', { id: object.id });
    },
    /**
     *
     *   on selection of the object it is invoked and updates the context menu
     *   @memberof Utils
     */
    objectSelected: function(event, data) {
        ecEditor.updateContextMenus([{ id: 'reorder', state: 'SHOW', data: {}}, 
                                            { id: 'copy', state: 'SHOW', data: {} },
                                            { id: 'delete', state: 'SHOW', data: {} }]);
    },
    /**
     *
     *   on Unselection of the object it is invoked and updates the context menu
     *   @memberof Utils
     */
    objectUnSelected: function(event, data) {
        ecEditor.updateContextMenus([{ id: 'reorder', state: 'HIDE', data: {}},
                                            { id: 'copy', state: 'HIDE', data: {} },
                                            { id: 'delete', state: 'HIDE', data: {} }]);
    }
});
//# sourceURL=utilsplugin.js