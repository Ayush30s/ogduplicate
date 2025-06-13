import GooglePayButton from "@google-pay/button-react";

const GooglePaymentButton = () => {
  <div>
    <GooglePayButton
      environment="TEST"
      buttonSizeMode="fill"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["MASTERCARD", "VISA"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "example",
                gatewayMerchantId: "exampleGatewayMerchantId",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "12345678765432123451",
          merchantName: "Ayush Srivastav",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: item.price.toFixed(2),
          currencyCode: "USD",
          countryCode: "US",
        },
      }}
      onLoadPaymentData={paymentData => {
        history.push('/confirm')
      }}
    />
    <button>Pay</button>
  </div>;
};

export default GooglePaymentButton;
