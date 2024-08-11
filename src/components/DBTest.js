import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';


function DBtest() {
    const [data, setData] = useState({
      cards: [],
      fields: []
    });
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [toRender, setToRender] = useState(null);
    const togglePopup = (popUp = null) => {
      setIsPopupVisible(!isPopupVisible);
      if (popUp) {
        setToRender(popUp);
      }
    };
  
    const fetchCardProps = async (cardId) => {
      try {
        const res = await axios.get(`http://localhost:9000/getCardProperties/${cardId}`);
        return res.data;
      } catch (err) {
        console.error(err);
        return {};
      }
    }
    useEffect(() => {
      axios.get('http://localhost:9000/getCards')
        .then(async (res) => {
          const results = await Promise.all(res.data.map(async (card) => {
            const properties = await fetchCardProps(card._id)
            console.log(card._id, properties)
            return {
              ...card, properties: properties
            }
          }))
          setData({ ...data, cards: results })
        })
        .catch((err) => {
          console.error(err)
        })
      axios.get('http://localhost:9000/getFields')
        .then((res) => {
          setData({ ...data, fields: res.data })
        })
        .catch((err) => {
          console.error(err)
        })
    }, [])
  
  
    const listProps = (p) => {
      console.log(p)
      return p.map(({property, value}) => {
        return (
          <div key={property._id}>
            {value ? <small>{`${property.name}: ${value}`}</small> :
              <small>{property.name}</small>}
            
          </div>
        )
      })
    }
    const listCards = (cards) => {
      return cards.map((card) => {
        return (
          <div key={card._id}>
            <h4>{card.name}</h4>
            {listProps(card.properties)}
          </div>
        );
      });
    }
    const listMembers = (field) => {
      //
    }
    const listFields = (fields) => {
      return fields.map((field) => {
        return (
          <div key={field._id}>
            <h2>{field.name}</h2>
            <h2>Members:</h2>
            {listMembers(field.members)}
          </div>
        );
      });
    }
    return (
      <div style={{
        maxWidth: "80vw",
        margin: "auto",
      }}>
        <h1>DB test</h1>
        <h2>Cards</h2>
        {<div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: "2em",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
  
        }}>
            {listCards(data.cards)}
        </div>}
        <h2>Fields</h2>
        {}
        
        <div style={{
          padding: "2em",
          paddingBottom: "20em",
        }}>
          {isPopupVisible ? <>
            {toRender ?? toRender()}
            <button onClick={togglePopup}>Hide</button>
          </> : <>
            <button onClick={() => togglePopup(() => {return <PropGen/>})}>Add Property</button>
            <button onClick={() => togglePopup(() => {return <CardGen/>})}>Add Card</button>
          </>}
        </div>
        
      </div>
    );
}
  
function PropGen(){

    const Types = {
        TEXT: "text",
        NUMBER: "number",
        DATE: "date",
        BOOLEAN: "boolean",
        TAG: "tag"
    }
    const [data, setData] = useState({
        name: "",
        type: ""
    })
    const handleChangeName = (e) => {
        setData({ ...data, name: e.target.value })
    }
    const handleChangeType = (e) => {
        setData({ ...data, type: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:9000/createProperty', data)
        .then((res) => {
            console.log(res);
            window.location.reload();
        })
        .catch((err) => {
            console.error(err);
        })
    }
    return (
        <div style={{backgroundColor: '#f0f0f0'}}>
        <form onSubmit={handleSubmit}>
            <label>
            Name:
            <input type="text" name="name" onChange={handleChangeName} />
            </label>
            <label>
            Type:
            <select name="type" value = {data.type} onChange={handleChangeType}>
                <option value={Types.TEXT}>Text</option>
                <option value={Types.NUMBER}>Number</option>
                <option value={Types.DATE}>Date</option>
                <option value={Types.BOOLEAN}>Boolean</option>
                <option value={Types.TAG}>Tag</option>
            </select>
            </label>
            <button type="submit">Submit</button>
        </form>
        </div>
    );

}

function CardGen(){

    const [data, setData] = useState({
        name: "",
        propValues: {} // _id: {value : str, name : str}
    })
    const [properties, setProperties] = useState([])
    const [selectedProps, setSelectedProps] = useState([])
    useEffect(() => {
        axios.get('http://localhost:9000/getProperties')
        .then((res) => {
            setProperties(res.data)
        })
        .catch((err) => {
            console.error(err)
        })
    }, [])

    const typeToInput = {
        "text": "text",
        "number": "number",
        "date": "date",
        "boolean": "checkbox"
    }
    const onUpdateName = (e) => {
        e.preventDefault()
        setData({...data, name: e.target.value})
    }

    const onUpdateProp = (e, name, propId) => {
        e.preventDefault()
        setData({...data, propValues: {...data.propValues, [propId]: {value: e.target.value, name}}})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(data)
        axios.post('http://localhost:9000/createCard', {name: data.name, creator_id: "000000000000000000000000"})
        .then((res) => {
            console.log(res)
            axios.post('http://localhost:9000/assignProperties', {card: res.data._id, assignments: Object.entries(data.propValues).map(
            entry => ({property: entry[0], ...entry[1]}) // flatten map into list of assignments
            )})
            .then((res) => {
                console.log(res)
                window.location.reload()
            })
            .catch((err) => {
                console.error(err)
            })

        })
        .catch((err) => {
            console.error(err)
        })
        
        

    }
    return (
        <div style={{
        backgroundColor: '#E3E2DF',
        padding: "0.5em",
        borderRadius: "10px 10px 10px 10px"
        }}>
        <h1>Card Generator</h1>
        <form onSubmit={handleSubmit} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <label>
                Name:
                <input type="text" name="name" onChange={onUpdateName} />
            </label><br/>
            <Select 
            options={properties} 
            value={selectedProps} 
            isMulti
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.name}
            onChange={(options) => {
                for(const removed of selectedProps.filter(prop => !options.includes(prop))) {
                    console.log("removing...", removed)
                    const updated = {...data.propValues}
                    delete updated[removed._id]
                    setData({...data, propValues: updated})
                }
                setSelectedProps(options)
            }}
            />
            <ul style={{
            listStyleType: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 0,
            }}>
            {selectedProps.map((prop) => {
                if (prop.type === "tag" && data.propValues && !data.propValues[prop._id]) {
                    setData({...data, propValues: {...data.propValues, [prop._id]: {name: prop.name}}})
                }
                return (
                <li key={prop._id} style={{
                    width: "100%",
                    textAlign: "center",
                    paddingLeft: "1em",
                    paddingRight: "1em",
                }}>
                    <h2>{prop.name}</h2>
                    {prop.type !== "tag" &&
                    <input type={typeToInput[prop.type]} name={prop.name} onChange={(e) => onUpdateProp(e, prop.name, prop._id)}/>}
                </li>
                )
            })}
            </ul>
            <button type="submit">Submit</button>
        </form>
        </div>
    )
}

function FieldGen(){

}

export default DBtest;
  