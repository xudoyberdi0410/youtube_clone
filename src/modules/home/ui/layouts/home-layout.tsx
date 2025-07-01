import { BaseLayout } from "@/components/layouts/BaseLayout";

interface HomeLayoutProps {
    children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
    return <BaseLayout withContainer={false}>{children}</BaseLayout>;
};