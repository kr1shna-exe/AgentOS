export interface SidebarContextValue {
    isOpen: boolean
    toggle: () => void
};

export interface SidebarProps {
    onLoginClick: () => void
    onNewChat?: () => void
};

export interface CategoryButtonsProps {
    onCategoryClick?: (categoryId: string) => void
};