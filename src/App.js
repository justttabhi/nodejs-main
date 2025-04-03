import React, { useEffect, useRef, useState } from "react";
import { Table, Badge, Button, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AddUser, UpdateUser } from "./helpers/PostRquest/postRquest";
import Swal from "sweetalert2";
import { DeleteUser, GetAllUsers, GetUserById } from "./helpers/GetRquest/getRquest";
import { CirclePlus, Eye, Pencil, Trash } from "lucide-react";

const AssetTable = () => {

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [userList, setUserList] = useState([]);
  const [view, setView] = useState('');
  const [photo, setPhoto] = useState('');
  // const [editImg, setEditImg] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {

      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_number: "",
      profile_photo: ""
    },
  });

  useEffect(() => {
    GetAllUsers()
      .then((response) => {
        console.log(response);
        setUserList(response)

      })
      .catch((error) => {
        console.log(error);

      });

  }, [])

  const handleView = (item) => (e) => {

    GetUserById(item.id)
      .then((response) => {
        console.log(response);
        setView(response)
        setShowView(true)
      })
      .catch((error) => {
        console.log(error);

      });
  }

  const handleDelete = (item) => (e) => {
    DeleteUser(item.id)
      .then((response) => {
        if (response) {
          Swal.fire({
            icon: 'success',

            text: 'User deleted successfully',
          });
          GetAllUsers()
            .then((response) => {
              console.log(response);
              setUserList(response)

            })
            .catch((error) => {
              console.log(error);

            });
        }

      })
      .catch((error) => {
        console.log(error);
      });
  }

  const imageRef = useRef(null);
  const handleImageUpload = (event) => {
    // setValue("profile_photo", event.target.files)
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        imageRef.current.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (item) => (e) => {

    GetUserById(item.id)
      .then((response) => {
        console.log(response);
        setValue("id", response[0].id)
        setValue("first_name", response[0].first_name)
        setValue("last_name", response[0].last_name)
        setValue("email", response[0].email)
        setValue("phone_number", response[0].phone_number)
        setValue("password", response[0].password)
        // setValue("profile_photo", response[0].profile_photo)
        setPhoto(response[0].profile_photo)
        setShowEdit(true)
      })
      .catch((error) => {
        console.log(error);

      });
  }

  const onSubmitAdd = (data) => {
    console.log('dsdsdsdsdsdsd', data);
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone_number', data.phone_number);
    formData.append('profile_photo', data.profile_photo[0]);

    console.log('formData---', formData);
    AddUser(formData)
      .then((response) => {
        console.log('responseresponse---', response);
        if (!response?.message) {
          Swal.fire({
            icon: 'success',
            text: "User saved successfully",
          });
          GetAllUsers()
            .then((response) => {
              console.log(response);
              setUserList(response)

            })
            .catch((error) => {
              console.log(error);

            });
          setShowAdd(false)

        }
        else {
          Swal.fire({
            icon: 'error',
            text: response?.message,
          });
        }

      })
      .catch((error) => {
        console.log(error);

      });
  };

  const onSubmitEdit = (data) => {
    console.log('EDIT DATA_________', data);
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone_number', data.phone_number);
    // if(photo){
      formData.append('profile_photo', data.profile_photo[0]);
    // }

    console.log('formData---', formData);
    UpdateUser(formData)
      .then((response) => {
        if (response) {
          Swal.fire({
            icon: 'success',
            text: 'User edited successfully',
          });
          GetAllUsers()
            .then((response) => {
              console.log(response);
              setUserList(response)

            })
            .catch((error) => {
              console.log(error);

            });
          setShowEdit(false)
        }

      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',

          text: error.response.data,
        });
      });
  }

  return (
    <Row style={{ padding: '28px' }}>
      <Col>
        <Card >
          <Card.Header>
            <Row>
              <div className="col">
                <Card.Title as="h5">Users</Card.Title>
              </div>
              <div className="col">
                <Col className="text-end">
                  <Button
                    className="m-0"
                    variant="primary"
                    onClick={() => setShowAdd(true)}
                  >
                    <CirclePlus />
                  </Button>
                </Col>
              </div>
            </Row>
          </Card.Header>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Phone number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userList?.map((item, index) => (
                <tr key={item.id}>
                  <th>{index + 1}</th>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone_number}</td>
                  {/* <td>{new Date(item.purchaseDate).toLocaleDateString("en-GB").replace(/\//g, "-")}</td> */}


                  <td>
                    <Button
                      className="m-1"
                      variant="primary" onClick={handleEdit(item)}>

                      <Pencil />
                    </Button>
                    <Button
                      className="m-1"
                      variant="primary" onClick={handleView(item)}>

                      <Eye />
                    </Button>
                    <Button
                      className="m-1"
                      variant="primary" onClick={handleDelete(item)}>

                      <Trash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Col>

      <Modal size="lg" show={showAdd} onHide={() => { setShowAdd(false); reset(); }}>
        <Modal.Header closeButton>
          <Modal.Title>Add new user details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmitAdd)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form01">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    {...register("first_name", { required: "First name is required" })}
                  />
                  {errors.first_name && <Form.Text className="text-muted">{errors.first_name.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form02">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    {...register("last_name", { required: "Last name is required" })}
                  />
                  {errors.last_name && <Form.Text className="text-muted">{errors.last_name.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form03">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <Form.Text className="text-muted">{errors.email.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form04">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && <Form.Text className="text-muted">{errors.password.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form05">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter phone number"
                    {...register("phone_number", { required: "Phone number is required" })}
                  />
                  {errors.phone_number && <Form.Text className="text-muted">{errors.phone_number.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form06">
                  <Form.Label>Profile photo</Form.Label>

                  <Form.Control
                    type="file" accept="image/*"

                    {...register("profile_photo", {
                      required: "Profile photo is required",
                      onChange: (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPhoto(reader.result);
                            // imageRef.current.src = reader.result;
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    })}
                  />
                  {errors.profile_photo && <Form.Text className="text-muted">{errors.profile_photo.message}</Form.Text>}
                </Form.Group>
                <div>

                  {photo ? (
                    <img src={photo} alt="Profile" style={{ width: "250px", height: "200px", objectFit: "cover" }} />
                  ) : (""

                  )}
                </div>
              </Col>

            </Row>
            <Row>
              <Col md={12} className="text-end">
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal>

      <Modal size="lg" show={showEdit} onHide={() => { setShowEdit(false); reset() }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit user details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmitEdit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form07">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    {...register("first_name", { required: "First name is required" })}
                  />
                  {errors.first_name && <Form.Text className="text-muted">{errors.first_name.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form08">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    {...register("last_name", { required: "Last name is required" })}
                  />
                  {errors.last_name && <Form.Text className="text-muted">{errors.last_name.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form09">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email" disabled
                    placeholder="Enter email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <Form.Text className="text-muted">{errors.email.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form10">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && <Form.Text className="text-muted">{errors.password.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form11">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter phone number"
                    {...register("phone_number", { required: "Phone number is required" })}
                  />
                  {errors.phone_number && <Form.Text className="text-muted">{errors.phone_number.message}</Form.Text>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="form12">
                  <Form.Label>Profile photo</Form.Label>
                
                      <Form.Control
                        type="file" accept="image/*" ref={imageRef}
                        onChange={handleImageUpload}
                        {...register("profile_photo", { required: false })}
                        // src={photo}

                      />
                       {/* {errors.profile_photo && <Form.Text className="text-muted">{errors.profile_photo.message}</Form.Text>} */}
                   
                      <div>
                        {/* <button onClick={() => setEditImg(true)}>edit</button> */}
                        {photo ? (
                          <img src={photo} alt="Profile" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                        ) : (
                          <span>No photo available</span>
                        )}
                      </div>

                    
                  {/* {photo && <Form.Text className="text-muted">Profile photo is required</Form.Text>} */}
                </Form.Group>
              </Col>

            </Row>
            <Row>
              <Col md={12} className="text-end">
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal>

      <Modal size="lg" show={showView} onHide={() => setShowView(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View user details</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="form14">
                <Form.Label>First Name:  {view[0]?.first_name}</Form.Label>

              </Form.Group>
            </Col>

            {/* Last Name */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="form16">
                <Form.Label>Last Name: {view[0]?.last_name}</Form.Label>

              </Form.Group>
            </Col>

            {/* Email */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="form18">
                <Form.Label>Email:  {view[0]?.email}</Form.Label>

              </Form.Group>
            </Col>

            {/* Phone Number */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="form22">
                <Form.Label>Phone Number:  {view[0]?.phone_number}</Form.Label>

              </Form.Group>
            </Col>

            {/* Profile Photo */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fdorm122">
                <Form.Label>Profile Photo:</Form.Label>
                <div>
                  {view[0]?.profile_photo ? (
                    <img src={view[0]?.profile_photo} alt="Profile" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                  ) : (
                    <span>No photo available</span>
                  )}
                </div>
              </Form.Group>
            </Col>

          </Row>


        </Modal.Body>
      </Modal>
    </Row >
  );
};

export default AssetTable;
