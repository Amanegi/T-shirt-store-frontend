import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { getCategory, updateCategory } from "./helper/adminapicall";

export default function UpdateCategory({ match, history }) {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    error: "",
    updatedCategoryName: "",
    success: false,
  });

  const { name, error, success, updatedCategoryName } = values;

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, name: event.target.value, error: "" });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "" });
    updateCategory(match.params.categoryId, user._id, token, { name })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
          console.log("My error: " + data.error);
        } else {
          setValues({
            updatedCategoryName: data.name,
            name: "",
            error: "",
            success: true,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: success ? "" : "none" }}
    >
      <h4>{updatedCategoryName} updated successfully.</h4>
    </div>
  );

  const warningMessage = () => (
    <div
      className="alert alert-danger mt-3"
      style={{ display: error ? "" : "none" }}
    >
      <h4>Failed to update the product!</h4>
    </div>
  );

  const redirectToAdminDashboard = () => {
    if (success) {
      setTimeout(() => {
        history.push("/admin/dashboard");
      }, 2000);
    }
  };

  return (
    <Base
      title="Update category"
      description="Update an existing category for the products"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded p-4">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {warningMessage()}
          {redirectToAdminDashboard()}
          <form>
            <div className="form-group">
              <p className="lead">Enter the category</p>
              <input
                type="text"
                className="form-control my-3"
                autoFocus
                required
                onChange={handleChange}
                value={name}
                placeholder="For Eg. Summer"
              />
              <button onClick={onSubmit} className="btn btn-outline-success">
                Update category
              </button>
            </div>
          </form>
        </div>
      </div>
    </Base>
  );
}
