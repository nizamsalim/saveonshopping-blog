import React from "react";

function Alert({ alert }) {
  return (
    <div className={`alert alert-${alert.type}`} role="alert">
      {alert.message}
    </div>
  );
}

export default Alert;
