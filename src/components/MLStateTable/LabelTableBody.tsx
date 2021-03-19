import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { RootState } from "../../store/AppState";

interface OwnProps {}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const LabelTableBody: React.FC<Props>  = (props) => {

  return (
      <>
      </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {

  };
};

export default connect(mapStateToProps)(LabelTableBody);
