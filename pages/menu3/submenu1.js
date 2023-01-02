import React, { useState } from "react";

export default function App() {
  return <div>submenu1dssds</div>;
}

export async function getServerSideProps({ req }) {
  const headers = req ? req.headers : {};
  return { props: { headers } };
}
