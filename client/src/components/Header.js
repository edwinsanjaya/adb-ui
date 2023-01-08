import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar end="true" color="dark" expand="sm" dark {...args}>
        <NavbarBrand href="/">ADB Viewer</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Supplier
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem href="/suppliers/search">Search</DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="/suppliers/map">Map</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="/products/search">Product</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/orders/search">Order</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Tools
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem href="/tools/query">Query Tools</DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="https://workspace-preview.neo4j.io/workspace/explore" target="_blank" rel="noopener noreferrer">Graph Tools</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/* <NavbarText>Simple Text</NavbarText> */}
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;