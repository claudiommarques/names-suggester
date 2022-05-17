import styles from './NamePopularityList.module.css';

export const NamePopularityList  = ({data}) => {
  return (
      <table className={styles.list}>
        <thead>
          <tr>
            <th>Year</th>
            <th>Gender</th>
            <th>Ethnicity</th>
            <th>Name</th>
            <th>Number of occurrences</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
        {
          data.map((item) => (
            <tr key={`${item[0]}-${item[1]}-${item[2]}-${item[3]}-${item[4]}-${item[5]}`}>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
              <td>{item[2]}</td>
              <td>{item[3]}</td>
              <td>{item[4]}</td>
              <td>{item[5]}</td>
            </tr>
          ))
        }
        </tbody>
    </table>
  );
}
