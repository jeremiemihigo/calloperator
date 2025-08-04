"use client";
import HeaderComponent from "@/app/header/Header";
import UploadingCustomer from "./Uploading";

function page() {
  return (
    <HeaderComponent title="Upload payments">
      <UploadingCustomer />
    </HeaderComponent>
  );
}

export default page;
