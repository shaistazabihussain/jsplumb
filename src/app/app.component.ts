import { Component, ViewChild } from '@angular/core';
import { jsPlumb, jsPlumbToolkit, Surface } from "jsplumbtoolkit";
import { jsPlumbSurfaceComponent, jsPlumbService } from "jsplumbtoolkit-angular";

// ----------------------- node components -------------------------
// TODO figure out how these can be created more easily.
@Component({
  template: ''
})
class BaseNodeComponent {
    toolkit:jsPlumbToolkit;
    surface:Surface;
    _el:any;
    obj:any;

    ngAfterViewInit() {
        this.surface.getJsPlumb().revalidate(this._el);
    }
}

// ----------------- node -------------------------------

@Component({    
    template:`<div>
    <div class="name">
        <div class="delete" title="Click to delete" (click)="remove(obj)">
            <i class="fa fa-times"></i>
        </div>
        <span>{{obj.name}}</span>
    </div>
    <div class="connect"></div>
    <jtk-source filter=".connect"></jtk-source>
    <jtk-target></jtk-target>
</div>`
})
export class NodeComponent extends BaseNodeComponent {
    remove(obj:any) {
        this.toolkit.removeNode(obj);
    }
}

// ----------------- group -------------------------------

@Component({
    template:`<div>
    <div class="group-title">
        {{obj.title}}
        <button class="expand" (click)="toggleGroup(obj)"></button>
    </div>
    <div jtk-group-content="true"></div>
</div>`
})
export class GroupComponent extends BaseNodeComponent {

    toggleGroup(group:any) {
        this.surface.toggleGroup(group);
    }
}


// -------------- /node components ------------------------------------

@Component({
    selector: 'jsplumb-demo',
    template: `<div class="sidebar node-palette" jsplumb-palette selector="div" surfaceId="demoSurface" [typeExtractor]="typeExtractor">                
                <div *ngFor="let nodeType of draggableTypes" [attr.data-node-type]="nodeType.type" title="Drag to add new" [attr.jtk-group]="nodeType.group" class="sidebar-item">
                        {{nodeType.label}}
                </div>
                </div>
                <jsplumb-surface [surfaceId]="surfaceId" [toolkitId]="toolkitId" [view]="view" [renderParams]="renderParams" [toolkitParams]="toolkitParams"></jsplumb-surface>                
              
            <jsplumb-controls [surfaceId]="surfaceId"></jsplumb-controls>
            <jsplumb-dataset [toolkitId]="toolkitId"></jsplumb-dataset>
            <jsplumb-miniview [surfaceId]="surfaceId"></jsplumb-miniview>
                `
})
export class AppComponent {

  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent:jsPlumbSurfaceComponent;

  toolkit:jsPlumbToolkit;
  surface:Surface;

  toolkitId:string;
  surfaceId:string;

  constructor(private $jsplumb:jsPlumbService) {
      this.toolkitId = "demo";
      this.surfaceId = "demoSurface";
  }

  ngOnInit() {
      this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams)
  }

  draggableTypes = [
      {label: "Node", type: "node"},
      {label: "Group", type: "group", group:true }
  ];

  toolkitParams = {
      groupFactory:(type:string, data:any, callback:Function) => {
          data.title = "Group " + (this.toolkit.getGroupCount() + 1);
          callback(data);
      },
      nodeFactory:(type:string, data:any, callback:Function) => {
          data.name = (this.toolkit.getNodeCount() + 1);
          callback(data);
      }
  };

  toggleSelection(node:any) {  
      this.toolkit.toggleSelection(node);
  }

  view = {
      nodes:{
          "default":{
              component:NodeComponent
          }
      },
      groups:{
          "default":{
              component:GroupComponent,
              endpoint:"Blank",
              anchor:"Continuous",
              revert:false,
              orphan:true,
              constrain:false
          },
          constrained:{
              parent:"default",
              constrain:true
          }
      }
  };


  renderParams = {
      layout:{
          type:"Absolute"
      },
      events: {
          canvasClick: (e:Event) => {
              this.toolkit.clearSelection();
          }
      },
      jsPlumb: {
          Anchor:"Continuous",
          Endpoint: "Blank",
          Connector: [ "StateMachine", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" } ],
          PaintStyle: { strokeWidth: 1, stroke: '#89bcde' },
          HoverPaintStyle: { stroke: "orange" },
          Overlays: [
              [ "Arrow", { fill: "#09098e", width: 10, length: 10, location: 1 } ]
          ]
      },
      lassoFilter: ".controls, .controls *, .miniview, .miniview *",
      dragOptions: {
          filter: ".delete *"
      },
      consumeRightClick:false
  };

  typeExtractor(el:Element) {
      return el.getAttribute("data-node-type");
  }

  ngAfterViewInit() {

      this.surface = this.surfaceComponent.surface;
      this.toolkit = this.surface.getToolkit();
      this.toolkit.load({
          data : {
              "groups":[
                  {"id":"one", "title":"Group 1", "left":100, top:50 },
                  {"id":"two", "title":"Group 2", "left":450, top:250, type:"constrained"  }
              ],
              "nodes": [
                  { "id": "window1", "name": "1", "left": 10, "top": 20, group:"one" },
                  { "id": "window2", "name": "2", "left": 140, "top": 50, group:"one" },
                  { "id": "window3", "name": "3", "left": 450, "top": 50 },
                  { "id": "window4", "name": "4", "left": 110, "top": 370 },
                  { "id": "window5", "name": "5", "left": 140, "top": 150, group:"one" },
                  { "id": "window6", "name": "6", "left": 50, "top": 50, group:"two" },
                  { "id": "window7", "name": "7", "left": 50, "top": 450 }
              ],
              "edges": [
                  { "source": "window1", "target": "window3" },
                  { "source": "window1", "target": "window4" },
                  { "source": "window3", "target": "window5" },
                  { "source": "window5", "target": "window2" },
                  { "source": "window4", "target": "window6" },
                  { "source": "window6", "target": "window2" }
              ]
          },
          onload:() => {
              this.surface.centerContent();
              this.surface.repaintEverything();
          }
      });
  }

}
