import React from "react";
import { useRouter } from "next/router";
import { Breadcrumb } from "antd";
import Link from "next/link";

const BreadCrumb = () => {
  const router = useRouter();
  const breadCrumbView = () => {
    const { asPath } = router;
    const pathnames = asPath.split("/").filter((item) => item);
    console.log(router);
    const capatilize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 25px" }}>
          {pathnames.length > 0 ? (
            <Breadcrumb.Item>
              <Link href="/">Home</Link>
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          )}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return isLast ? (
              <Breadcrumb.Item key={index}>{capatilize(name)}</Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item key={index}>
                <Link href={`${routeTo}`}>{capatilize(name)}</Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>
    );
  };

  return <>{breadCrumbView()}</>;
};

export default BreadCrumb;
