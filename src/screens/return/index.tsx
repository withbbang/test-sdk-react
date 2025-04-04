import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropState } from 'middlewares/configureReducer';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { usePostDataHook, useSetToastPopupHook } from 'modules/customHooks';
import { APPROVE_URL } from 'modules/constants';
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
  const useSetToastPopup = useSetToastPopupHook();

  useEffect(() => {
    let key = '';
    let amount = '';
    const queries = queryString.toString().split('&');

    queries[0].substring(1);

    const params = queries.map((query) => {
      const [head, body] = query.split('=');

      if (head === 'key') key = body;
      if (head === 'amount') amount = body;

      return decodeURIComponent(query);
    });

    setParams(params);

    usePostData({ key, amount });
  }, []);

  const { usePostData } = usePostDataHook({
    url: `${APPROVE_URL}`,
    successCb: () => useSetToastPopup('결제 성공'),
    failCb: () => useSetToastPopup('결제 실패'),
  });

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
