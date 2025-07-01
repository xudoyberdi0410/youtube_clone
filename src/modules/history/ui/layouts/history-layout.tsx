import { BaseLayout } from "@/components/layouts/BaseLayout";

interface HistoryLayoutProps {
    children: React.ReactNode;
}

export const HistoryLayout = ({ children }: HistoryLayoutProps) => {
    return <BaseLayout withContainer={true}>{children}</BaseLayout>;
};
