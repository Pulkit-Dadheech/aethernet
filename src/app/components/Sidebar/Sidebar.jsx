import React from "react";
import SidebarButton from "./SidebarButton.jsx";
import { useSidebar } from "../../../context/SidebarContext.jsx";

const Sidebar = (props) => {
  const { titleName, activeSectionList, LogoComponents, sectionNames } = props;
  const { activeSection, setActiveSection } = useSidebar(activeSectionList[0]);

  return (
    <aside className="w-full min-h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col py-8 px-3 shadow-md transition-colors">
      {/* Logo and title */}
      {/* <div className="flex items-center mb-10 px-2">
        <span className="text-xl"></span>
        <span className="text-xl font-bold text-sidebar-secondary">{titleName}</span>
      </div> */}
      {/* All Components */}
      <nav className="flex flex-col gap-3">
        {sectionNames.map((sectionName, index) => (
          <SidebarButton
            key={index}
            sectionName={sectionName}
            currentSection={activeSectionList[index]}
            LogoComponent={LogoComponents[index] ? LogoComponents[index] : null}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;