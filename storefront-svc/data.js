const checkout = {
    "storeId": "516a42b4-241d-425e-9b16-ec9ceb044619",
    "id": "ch_uhPvPScGn4xPqg7OB9g",
    "email": null,
    "shipments": [
        {
            "id": "shp_zUbfZaIMQqeWrCTScE45VQ",
            "items": [
                {
                    "offerId": "9099c654-5520-476f-9ba7-3266844716a4",
                    "variantId": "e25235f5-f596-4298-a088-6eb9f0455088",
                    "quantity": 5,
                    "unitPrice": {
                        "value": 15,
                        "currency": "USD"
                    }
                }
            ],
            "rates": [
                {
                    "id": "srt_DnIyAvbmQvuF37licTi7zw",
                    "shipmentId": "shp_zUbfZaIMQqeWrCTScE45VQ",
                    "service": "STANDARD",
                    "description": "Flat Rate",
                    "price": {
                        "value": 11.95,
                        "currency": "USD"
                    },
                    "type": "STANDARD",
                    "totalDeliveryTime": {
                        "from": "2024-01-12T19:44:53.732981077Z",
                        "to": "2024-01-22T19:44:53.732981077Z"
                    }
                }
            ],
            "selectedRate": {
                "id": "srt_DnIyAvbmQvuF37licTi7zw",
                "shipmentId": "shp_zUbfZaIMQqeWrCTScE45VQ",
                "service": "STANDARD",
                "description": "Flat Rate",
                "price": {
                    "value": 11.95,
                    "currency": "USD"
                },
                "type": "STANDARD",
                "totalDeliveryTime": {
                    "from": "2024-01-12T19:44:53.732981077Z",
                    "to": "2024-01-22T19:44:53.732981077Z"
                }
            },
        }
    ],
    "payment": null,
    "paymentConfiguration": {
        "stripe": {
            "paymentMethodConfigurationId": "pmc_1OMW8HLgTfxsYzuGewCTJihy",
            "setupForFutureUsage": null
        }
    },
    "summary": {
        "grandTotal": {
            "value": 541.88,
            "currency": "USD"
        },
        "subtotalIncludingTax": {
            "value": 541.88,
            "currency": "USD"
        },
        "subtotalExcludingTax": {
            "value": 500,
            "currency": "USD"
        },
        "subtotalWithDiscountExcludingTax": {
            "value": 500,
            "currency": "USD"
        },
        "totalShippingCost": {
            "value": 11.95,
            "currency": "USD"
        },
        "discount": {
            "label": "SCANDIPWA",
            "amount": {
                "value": 0,
                "currency": "USD"
            }
        },
    },
    "metadata": {
        "ip": "196.119.20.29",
        "geo": {
            "city": "Kenitra",
            "region": "MA",
            "subdiv": "MA04",
            "latlong": "34.254050,-6.589017"
        }
    },
    "stepsConfig": {
        "availableSteps": [
            "information",
            "shipping",
            "payment"
        ],
        "currentStep": "payment",
    },
    "status": "Processing",
    "appliedCoupon": {},
    "expressCheckoutShipments": [
        {
            "id": "srt_DnIyAvbmQvuF37licTi7zw",
            "shipmentId": "shp_zUbfZaIMQqeWrCTScE45VQ",
            "service": "STANDARD",
            "description": "Flat Rate",
            "price": {
                "value": 11.95,
                "currency": "USD"
            },
            "type": "STANDARD",
            "totalDeliveryTime": {
                "from": "2024-01-12T19:44:53.732981077Z",
                "to": "2024-01-22T19:44:53.732981077Z"
            }
        }
    ],
    "tax": {
        "label": "US",
        "percent": 8.375,
        "amount": {
            "value": 41.88,
            "currency": "USD"
        }
    },
    "createdAt": "2023-12-29T19:14:45.798541Z",
    "updatedAt": "2023-12-29T19:44:52.56639Z"
}