import React from "react";

// PUBLIC_INTERFACE
function Header() {
  /** App header with title and brief description. */
  return (
    <header className="Header">
      <div className="Container HeaderInner">
        <div className="HeaderTitleBlock">
          <h1 className="HeaderTitle">Simple Notes</h1>
          <p className="HeaderSubtitle">
            Create, edit, and delete notes. Saved locally in your browser.
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
