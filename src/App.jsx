import { useEffect, useState } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
const App = () => {
  const [input, setInput] = useState("");
  // console.log(input);
  const [value, setValue] = useState(()=>{
    var rawData = localStorage.getItem("todo");
    if(!rawData){
      return [];
    }
    else{
      return JSON.parse(rawData);
    }
  });

  const [loader,setLoader] = useState(true);
 
  
  const [btn, setBtn] = useState(false);
  const [editIndex, setEditIndex] = useState();
  // for submit means add data
  const handleSubmit = (event) => {
    event.preventDefault();
    let newVal = value.find((v, i) => {
      return (v.todo == input);
    });
    if (!input) {
      // alert("box is empty.");
      toast.error("please enter data...");
      return false;
    }
    else if (newVal) {
      // alert("value already exist.");
      toast.error("data already exist...");
      setInput("");
      setBtn(false);
      return false;
    }

    else if (input.trim()) {
      if (btn) {
        let oldData = [...value];
        // let a1=oldData[editIndex];
        // console.log(a1);
        oldData[editIndex].todo = input;
        oldData[editIndex].date = new Date().toLocaleDateString();
        oldData[editIndex].time = new Date().toLocaleTimeString();
        setValue(oldData);
        setBtn(false);
        toast.success("data updated...");
        setInput("");
      }
      else {
        setValue([...value, { id: input, todo: input, done: false, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() }]);
        // toast.success("data inserted...");
        setInput("");
        // console.log("value: ", value);
      }
    }
    else {
      // alert("data not insert");
      toast.error("data not insert...");
    }

  }

  // for check uncheck
  const handleDone = (index) => {
    // alert(index);
    let newVal = value.map((item, i) => {
      if (item.id == index) {
        return ({ ...item, done: !item.done });
      }
      else {
        return (item);
      }
    })
    setValue(newVal);
  }

  // for delete
  const handleDelete = (index) => {
    var a = confirm("Are you sure...");
    if(a){
      let delData = value.filter((item, i) => {
        // alert("data deleted");
        return (i !== index);
      });
      // console.log("del: ",delData);
      setValue(delData);
      toast.success("data deleted...");
    }
    else{
      toast.error("data not delete...");
    }
  }

  const handleEdit = (index) => {
    let tempData = value[index];
    console.log(tempData);
    setInput(tempData.todo);
    setBtn(true);
    setEditIndex(index);
    // alert(index);
    // console.log(value);
  }

 const handleClearAll = () => {
  var a = confirm("Are you sure...");
  if(a){
  setValue([]);
  toast.success("All data deleted...");
  }
  else{
    toast.error("data not delete...");
  }
 }

  useEffect(()=>{
    localStorage.setItem("todo",JSON.stringify(value));
  },[value]);

  useEffect(()=>{
     setTimeout(() => {
       setLoader(false);
     }, 500);
  },[]);

  return (
    <>
     {loader?<div className="image"><img src="./images/loader.gif" alt="" /></div>:""}
    <div className="main1">
      <ToastContainer />
      <div className='m1'>
        <p className="heading">Todo List</p>
        <form onSubmit={handleSubmit}>
          <input type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter task here..." />
          <button className="btn">{btn ? "Update" : "Add"}</button>
        </form>
      </div>
      {value.map((v, i) => {
        return (
          
          <div className={`main ${v.done ? "p1" : ""}`} key={i}>
            <div className="item item1">{i + 1}.</div>
            <div className="item item2">{v.todo}</div>
            <div className="item item3">
              <div className="item3-child">{v.date}</div>
              <div className="item3-child">{new Date(`1970-01-01T${v.time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase()}</div>
            </div>
            <div className="item item4">
              <div className="item4-child"><div onClick={() => { handleDone(v.id) }}>{v.done ? <MdCancel className="d1"/>
                : <IoIosCheckmarkCircle className="d2"/>}</div></div>
              <div className="item4-child"><div onClick={() => handleEdit(i)}><FiEdit className="delbtn e1" /></div></div>
              <div className="item4-child"><div onClick={() => handleDelete(i)}><MdDeleteForever className="delbtn" /></div></div>
            </div>
          </div>
        )
      })}
      <div className="bt"><button className="btn1" onClick={handleClearAll}>Clear All</button></div>
    </div>
    </>
  );
}
export default App;
