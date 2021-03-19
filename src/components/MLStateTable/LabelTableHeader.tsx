import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import {RootState} from "../../store/AppState";

interface OwnProps {}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const LabelTableHeader: FunctionComponent<Props> = (props) => {

  return (
      <>
      </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {

  };
};

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(mapStateToProps)(LabelTableHeader);
