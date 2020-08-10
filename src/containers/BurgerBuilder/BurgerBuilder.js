import React, { Component } from "react";
import Auxilary from "../../hoc/Auxilary/Auxilary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import { Object } from "prop-types";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENTS_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };
  componentWillMount() {
    axios.get('https://react-my-burger-9399b.firebaseio.com/ingredients.json')
    .then(response => {
      this.setState({ingredients : response.data})
    })
    .catch(error => {
      this.setState({error: true })
    });
  }
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchasable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceDeducition = INGREDIENTS_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeducition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    
      this.setState({ purchasing: true });

  };

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false,
    });
  };

  purchaseContinueHandler = () => {
    // alert("You continue");
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Ishaan B',
        address: {
          street: 'Penny Lane',
          zipcode: 'L 18',
          country: 'UK'
        },
        email: 'test@test.com'

      },
      deliveryMethod: 'fastest!!' 
    }
    axios.post('/orders.json', order)
    .then(response =>{ 
      this.setState({loading: false, purchasing: false})
    })
    .catch(error => { 
      this.setState({loading: false, purchasing: false})
    })
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p>: <Spinner />

    if(this.state.ingredients) {
      burger = (
        <Auxilary>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice}
          />
        </Auxilary>
        );
        orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />
    }
    if(this.state.loading) {
      orderSummary = <Spinner />
    }
   
    return (
      <Auxilary>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
          {burger}
        </Modal>
      </Auxilary>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);