import React, {Component} from 'react'
import Auxilary from '../../../hoc/Auxilary/Auxilary'
import Button from '../../UI/Button/Button'

class OrderSummary extends Component {
    componentWillUpdate() {
        console.log("[OrderSummary] Willupdate");
      }
    render() {
        const ingredientSummary = Object.keys(this.props.ingredients).map(igKey => {
          return (
            <li key={igKey}>
              <span style={{ textTransform: 'capitalize' }}>
                {igKey} : {this.props.ingredients[igKey]}
              </span>
            </li>
          );
        });
    
        return (
            <Auxilary>
              <h3>Orders...</h3>
              <p>A delicious burger with the following ingredients:</p>
              <ul>{ingredientSummary}</ul>
              <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
              <p>Continue to Checkout?</p>
              <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
              <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </Auxilary>
          );    
    }
}

export default OrderSummary;



