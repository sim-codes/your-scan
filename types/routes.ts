type Routes = {
    routeNames: never[];
};

export type navigationProps = {
    navigate: (screen?: string) => void;
    goBack: () => void;
    reset: (index: number, routeNames: Routes[]) => void;
};
