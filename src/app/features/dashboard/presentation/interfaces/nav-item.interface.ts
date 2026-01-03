/**
 * Navigation item interface for sidebar navigation.
 */
export interface NavItem {
    /** Material icon name */
    readonly icon: string;
    /** Display label for the navigation item */
    readonly label: string;
    /** Route path for navigation */
    readonly route: string;
}
