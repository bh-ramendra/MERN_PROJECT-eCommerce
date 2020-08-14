import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { getCategory, updateCategory } from "./helper/adminapicall";
import { isAutheticated } from "../auth/helper";

const UpdateCategory = ({ match }) => {
  const [name, setName] = useState("");
  const { user, token } = isAutheticated();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      console.log("Data: " + data);
      if (data.error) {
        setError(true);
      } else {
        setError("");
        setSuccess("");
        setName(data.name);
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    updateCategory(match.params.categoryId, user._id, token, name).then(
      (data) => {
        console.log(data);
        if (data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName("");

          // Once submit is pressed i want to clear the fields
        }
      }
    );
  };

  const handleChange = (name) => (event) => {
    setError("");
    setName({ [name]: event.target.value });
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category updated successfully</h4>;
    }
  };

  const failureMessage = () => {
    if (error) {
      return <h4 className="text-fail">Failed to update category</h4>;
    }
  };

  const updateCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead">Enter the category</p>
        <input
          type="text"
          className="form-control my-3"
          onChange={handleChange("name")}
          defaultValue={name}
          autoFocus
          required
          placeholder="Ex. Summer"
        />
        <button onClick={onSubmit} className="btn btn-outline-info">
          Update category
        </button>
      </div>
    </form>
  );

  return (
    <Base
      title="Add prodcut"
      description="Welcome to product creation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashbord" className="btn btn-md btn-dark mb-3">
        Admin home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {failureMessage()}
          {updateCategoryForm()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
