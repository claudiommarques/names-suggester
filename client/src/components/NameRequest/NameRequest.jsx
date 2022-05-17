
import { useRef, useState } from 'react';
import styles from "./NameRequest.module.css"
import { camelCaseWord } from '../../utils/formatter/data';
import { Card } from '../Card/Card';
import babyImg from './assets/img/baby.jpeg';

//Here are some constants refering to this file/feature.
//In a real project it can be organized in a specific constanst file.
const GENDER_KEYS = {
  FEMALE: 'FEMALE',
  MALE: 'MALE',
}
const ATTRS_POSITION = {
  year: 0,
  gender: 1,
  ethnicity: 2,
  name: 3,
  numberOfOccurrences: 4,
  rank: 5,
};

export const NameRequest  = ({data}) => {
  const [suggestedName, setSuggestedName] = useState('');
  const alreadySuggested = useRef({ MALE:[], FEMALE:[] });
  let [lastClickedGender, setLastClickedGender] = useState('');
  let [filterValues, setFilterValues] = useState({ethnicity:'', year:''});

  //Get available options for each filter
  const availableFilterAttrOptions = (attr) => {
    const attrPos = ATTRS_POSITION[attr];

    return data.reduce((acc, item)=> {
      if (item.length){
        acc = acc || [];
        if (acc.indexOf(item[attrPos]) < 0){
          acc.push(item[attrPos]);
        }
      }
      return acc;
    }, [])
  };

  //Get available names to be used by the generator function (this function order names by their rank and considers the provided filters)
  const getNamesByGender = (gender) => {
    let temp = [...data];

    for (let filterAttr in filterValues){
      if (filterValues[filterAttr]){
        temp = temp.filter((item) => filterValues[filterAttr] === item[ATTRS_POSITION[filterAttr]]);
      }
    }

    return temp.filter((item)=>gender === item[1]).sort((a, b) => a[ATTRS_POSITION.rank]-b[ATTRS_POSITION.rank]);
  };

  //Handle change filter funtion (clear previous suggestion and handle filter values)
  const handleChangeFilter = (e) => {
      setSuggestedName('');
      alreadySuggested.current[GENDER_KEYS.FEMALE] = [];
      alreadySuggested.current[GENDER_KEYS.MALE] = [];
      setFilterValues({ ...filterValues, [e.target.name]: e.target.value });
  };
  
  //Finally, the name generator function. Here is where the magic happens,
  // the names are suggested based on previously handles data and last suggestions. (basically this is the submit function).
  const generateName = (gender) => {
    let nameToReqPos = alreadySuggested.current[gender].length ? alreadySuggested.current[gender].length : 0;
    const nameOfClickedGender = getNamesByGender(gender);

    const suggestNameRecursive = (gender, nameToReqPos) => {
      alreadySuggested.current[gender].push(nameOfClickedGender[nameToReqPos][ATTRS_POSITION.name]);
      setSuggestedName(nameOfClickedGender[nameToReqPos][ATTRS_POSITION.name]);
    }

    setLastClickedGender(gender);

    if (nameToReqPos < nameOfClickedGender.length && alreadySuggested.current[gender].indexOf(nameOfClickedGender[nameToReqPos][ATTRS_POSITION.name]) < 0){
      suggestNameRecursive(gender, nameToReqPos)
    } else {
      if ( nameToReqPos+1 > nameOfClickedGender.length ) {
        nameToReqPos = 0;
        alreadySuggested.current[gender] = [];
        suggestNameRecursive(gender, nameToReqPos)
      } else {
        suggestNameRecursive(gender, nameToReqPos+1)
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Do you want a baby?</h2>
      <p>Choose the gender</p>
      <p>
        <label>Based on ethnicity:</label>
        <select name="ethnicity" value={filterValues.ethnicity} onChange={handleChangeFilter}>
          <option value={''}>Any</option>
          {availableFilterAttrOptions('ethnicity').map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </p>
      <p>
        <label>Based on year:</label>
        <select name="year" value={filterValues.year} onChange={handleChangeFilter}>
          <option value={''}>Any</option>
          {availableFilterAttrOptions('year').map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </p>
      <button onClick={() => generateName(GENDER_KEYS.MALE)}>Male</button>
      <button onClick={() => generateName(GENDER_KEYS.FEMALE)}>Female</button>
      {suggestedName &&
        <>
          <h5>{`${camelCaseWord(lastClickedGender)} baby successfully generated with name:`}</h5>
          <Card>
            <img src={babyImg} alt="Baby" width="200px"/>
            <h2>{suggestedName}</h2>
          </Card>
        </>
      }
    </div>
  );
}
