export interface NavItem {
  label: string;
  href?: string;
  items?: { label: string; href?: string; onClick?: () => void }[];
}
export interface HeaderProps {
  logoSrc: string;
  title?: string;
  navItems: NavItem[];
  actions?: React.ReactNode;
}
interface DropdownNavMenuProps {
  label: string;
  items: DropdownItem[];
  className?: string;
}
