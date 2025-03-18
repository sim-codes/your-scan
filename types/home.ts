export type Display = "grid" | "list";
export type SortOption = "most-recent" | "name" | "date";

export type MeasureLayoutCallback = (
    x: number,
    y: number,
    width: number,
    height: number,
    pageX: number,
    pageY: number
) => void;

export interface FilterSortViewProps {
    initialDisplay?: Display;
    initialSortOption?: SortOption;
    onDisplayChange?: (display: Display) => void;
    onSortChange?: (sortOption: SortOption) => void;
    onAddPress?: () => void;
    sortOptions?: Array<{id: SortOption, label: string}>;
}
