import { AppSidebar } from "@/components/app-sidebar";
import Notification from "@/components/quick-notification";
import ThemeCustomizer from "@/components/theme-customizer";
import { useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const formatBreadcrumb = (segment) => {
  // Replace hyphens with spaces and capitalize each word
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const useBreadcrumbs = () => {
  const location = useLocation();
  const { pathname } = location;

  // Split pathname into segments and filter out empty strings
  const pathSegments = pathname.split("/").filter(Boolean);

  // Map segments to formatted breadcrumb labels
  const breadcrumbs = pathSegments.map(formatBreadcrumb);

  return breadcrumbs;
};

export default function Page({ children }) {
  const breadcrumbs = useBreadcrumbs();

  console.log(breadcrumbs);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Mechanical Dept.</BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbPage>{crumb}</BreadcrumbPage>
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="mr-4">
            <Notification />
            <ThemeCustomizer />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
