import React from "react";
import Actions from "../../components/editor/actions/actions";
import CardView from "../../components/editor/cardView/cardView";
import NavigationBar from "../../components/editor/navigationBar/navigationBar";
import SidePanel from "../../components/editor/sidePanel/sidePanel";

const Editor = () => {
  return (
    <div className="app">
        <NavigationBar />
        <div className="panel">
        <SidePanel />
        </div>
        <div className="editor">
        <CardView />
        <Actions />
        </div>

    </div>
  );
};

export default Editor;
