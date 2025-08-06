"use client";
import HeaderComponent from "@/app/header/Header";
import Tableau from "./Tableau";
import UploadingPayment from "./Uploading";

function Payements() {
  return (
    <HeaderComponent title="Upload payments">
      <UploadingPayment />
      <Tableau />
    </HeaderComponent>
  );
}

export default Payements;
