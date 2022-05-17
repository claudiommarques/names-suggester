
import { useEffect, useState } from 'react';
import { NamePopularityList } from '../../components/NamePopularityList';
import { NameRequest } from '../../components/NameRequest';
import styles from "./BabyGenerator.module.css"

export const BabyGenerator  = () => {
  let [data, setData] = useState([])
  const [showRankList, setShowRankList] = useState(false);

  //Function to get data in the top component (after data become availble this component orchestrate them to their children components, where they are needed).
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('mock.json');
      const responseData = await response.json();
      setData(responseData);
    }
    fetchData()
  }, []);

  //This is an extra feature, I've included here the list because it can be useful in case of any doubt.
  const toggleRankListVisibility = (e) => {
    e.preventDefault();//Preventing the default behavior of an <a> (redirect)
    setShowRankList(!showRankList);
  }

  return (
    <>
      <div className={styles.container}>
        <NameRequest data={data} />
      </div>
      <div className={styles.container}>
        <a onClick={toggleRankListVisibility} href="/">{`${showRankList ? 'Hide' : 'Show'} rank list`}</a>
      </div>
      <div className={styles.container}>
        {showRankList && <NamePopularityList data={data} />}
      </div>
    </>
  );
}
