import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropState } from 'middlewares/configureReducer';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import { connect } from 'react-redux';
import { Action } from 'redux';
import styles from './Return.module.scss';

function mapStateToProps(state: PropState): CommonState {
  return {
    ...state.common,
  };
}

function mapDispatchToProps(dispatch: (actionFunction: Action<any>) => any) {
  return {};
}

function Return(): React.JSX.Element {
  const [queryString] = useSearchParams();
  const [params, setParams] = useState<Array<string>>([]);

  useEffect(() => {
    const params = queryString.toString().split('&');

    params[0].substring(1);

    setParams(params.map((param) => decodeURIComponent(param)));
  }, []);

  return (
    <div className={styles.wrap}>
      <h1>가맹점 Return Page</h1>
      <p>결제 승인 로직 수행</p>
      {params.map((param) => (
        <p key={param}>{param}</p>
      ))}
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Return);
