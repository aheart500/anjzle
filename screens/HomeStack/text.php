
text/x-generic ordersController.php ( PHP script text )
<?php namespace App\Http\Controllers;

use App\Events\NewNotify;

use App\Order;
use App\Service;
use App\File;
use App\User;
use Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ordersController extends Controller
{
    public $configPayment;

    public function __construct()
    {
        if (config('hayprpay.type') == 'test') {
            $this->configPayment = config('hayprpay.test');
        } else {
            $this->configPayment = config('hayprpay');
        }
    }

    public function generalErrorMsg()
    {
        return trans('main.ThereIsAnErrorPlsTryAgainlater');
    }

    protected function getFileNameError($funcName, $msg = '')
    {
        $msg = $msg ? $msg : $this->generalErrorMsg();
        $fn = basename(__FILE__, '.php');
        return $msg . ': ' . $fn . '@' . $funcName;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            if (Auth::user()->is_admin()) {
                $orders = Order::orderBy('readed', 'ASC')
                    ->orderBy('last_msg_date', 'DESC')
                    ->orderBy('status_id', 'ASC')
                    ->get();
            } else {
                $orders = Order::where('user_id', Auth::user()->id)
                    ->orderBy('readed', 'ASC')
                    ->orderBy('last_msg_date', 'DESC')
                    ->orderBy('status_id', 'ASC')
                    ->get();
            }
            return view('admin.orders.index', compact('orders'));
        } catch (\Exception $ex) {
            return $this->getFileNameError('index');
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $service = Service::where([
            'id' => $request->service_id,
            'is_active' => 1,
        ])->first();
        if (!$service) {
            return 'عزرا هذه الخدمة غير موجوده أو تم حذفها';
        }
        $order = '';
        // $order = \
        return view('admin.orders.create', compact('service'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // try {

        if (!$request->service_id) {
            return 'يجب اختيار خدمة أولا';
        }
        $service = Service::where([
            'id' => $request->service_id,
            'is_active' => 1,
        ])->first();
        if (!$service) {
            return 'لا توجده هذه الخدمة';
        }

        $order = new order();
        $order->content = $request->content;
        $order->user_id = Auth::user()->id;
        $order->service_id = $service->id;
        $order->status_id = 1;
        $order->order_date = now();
        $order->last_msg_date = now();
        $order->is_canceled = 0;
        $order->save();
        $file = File::where([
            'fileable_id' => $request->fileId,
            'fileable_type' => 'App\Order',
        ])->first();
        if ($file) {
            $file->update(['fileable_id' => $order->id]);
        }

        $ordersCount =
            Order::where('readed', 0)->count() . '/' . Order::all()->count();
        $data = [
            'ordersCount' => $ordersCount,
            'adminId' => User::where('role_id', 1)->first()->id,
        ];
        event(new NewNotify($data));

        return redirect()
            ->route('msgs.edit', [$order->id])
            ->with(['success' => trans('main.SavedSuccessfully')]);

        // } catch (\Exception $ex) {
        //     return back()->with(['error' => $this->getFileNameError('store')]);
        // }
    }

    public function inQueryWithBay(Request $request)
    {
        if (!$request->service_id) {
            return 'يجب اختيار خدمة أولا';
        }
        $order = \App\Order::where('status_id', 1)->findOrFail(
            $request->order_id
        );
        $service = Service::where([
            'id' => $request->service_id,
            'is_active' => 1,
        ])->first();
        $service_id = $request->service_id;
        $price = $service->price;
        $transactionid = rand();
        session()->put('order_exist', $request->order_id);
        return view('mainpageis', compact(['service_id', 'price']));
    }

    public function inQueryWithBayResult($order_id, Request $request)
    {
        $checkoutId = $request->id;
        $name = 'mada';
        $data = Http::withHeaders([
            'Authorization' => $this->configPayment['authorize_id'],
        ])
            ->get(
                $this->configPayment['checkoutUrlStatus'] .
                    "/$checkoutId/payment?entityId=" .
                    $this->entity_id($name)
            )
            ->json();
        $service = \App\Service::find(session()->get('order')['service_id']);
        if (
            isset($data['result']['code']) &&
            ($data['result']['code'] == '000.000.000' ||
                $data['result']['code'] == '000.100.110')
        ) {
            if ($service != null) {
                $order = \App\Order::where([
                    'user_id' => auth()->id(),
                    'service_id' => $service->id,
                    'status_id' => 1,
                ])
                    ->find($order_id)
                    ->update([
                        'status_id' => 2,
                    ]);
                $payment = \App\Payment::create([
                    'user_id' => auth()->id(),
                    'order_id' => $order->id,
                    'service_id' => $service->id,
                    'bank_transaction_id' => $data['id'],
                    'amount' => $service->price,
                ]);

                if (session()->has('order_exist')) {
                    session()->forget('order_exist');
                }
                $msg = 'Order Successfully ';
                return redirect("admin/msgs/$order_id/edit");
            } else {
                $this->refund($this->entity_id($name), $service, $data['id']);
                $msg = 'Order Not Successfully';
                return view('admin.orders.index', compact(['msg']));
            }
        } else {
            $msg = 'Order Not Successfully';
            return view('admin.orders.index', compact(['msg']));
        }
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Order $order
     * @return \Illuminate\Http\Response
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Order $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Order $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Order $order
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order $order)
    {
        //
    }

    public function note()
    {
        $data = [
            'ordersCount' => 'data',
        ];
        event(new NewNotify($data));
        return 'ok';
    }

    public function payment_create($service_id, $order_id = '')
    {
        return view('admin.orders.payment', compact('service_id', 'order_id'));
    }

    public function payment_store(Request $request)
    {
        $service_id = $request->service_id;

        $services = Service::where(['id' => $service_id, 'is_active' => 1])
            ->orderBy('order', 'DESC')
            ->first();
        $price = $services->price;

        return view('mainpageis', compact(['service_id', 'price']));
    }

    public function entity_id($name = 'visa')
    {
        if (strtolower($name) == 'mada') {
            return $this->configPayment['entity_id_mada'];
        } else {
            return $this->configPayment['entity_id'];
        }
    }

    public function setUpPayment($id, $service_id, $price)
    {
        session()->put('order', [
            'service_id' => $service_id,
            'user_id' => auth()->id(),
        ]);
        $card_name = $id;
        $transactionid = rand();
        $data = Http::withHeaders([
            'Authorization' => $this->configPayment['authorize_id'],
        ])->post(
            $this->configPayment['checkoutUrl'] .
                '?entityId=' .
                $this->entity_id($id) .
                "&amount=$price&currency=" .
                $this->configPayment['currency'] .
                '&paymentType=' .
                $this->configPayment['paymentTypeCheckout'] .
                '&merchantTransactionId=' .
                $transactionid
        );
        $checkoutId = $data['id'];
        return view(
            'mainpageis',
            compact(['checkoutId', 'card_name', 'service_id', 'price'])
        );
    }

    public function setUpPayment2($id, $service_id, $price)
    {
        session()->put('order', [
            'service_id' => $service_id,
            'user_id' => auth()->id(),
        ]);
        $card_name = $id;
        $transactionid = rand();
        $data = Http::withHeaders([
            'Authorization' => $this->configPayment['authorize_id'],
        ])->post(
            $this->configPayment['checkoutUrl'] .
                '?entityId=' .
                $this->entity_id($id) .
                "&amount=$price&currency=" .
                $this->configPayment['currency'] .
                '&paymentType=' .
                $this->configPayment['paymentTypeCheckout'] .
                '&merchantTransactionId=' .
                $transactionid
        );
        $checkoutId = $data['id'];
        return $data;
    }

    public function get_result($name, $checkoutId)
    {
        $data = Http::withHeaders([
            'Authorization' => $this->configPayment['authorize_id'],
        ])
            ->get(
                $this->configPayment['checkoutUrlStatus'] .
                    "/$checkoutId/payment?entityId=" .
                    $this->entity_id($name)
            )
            ->json();
        $service = \App\Service::find(session()->get('order')['service_id']);
        if (
            isset($data['result']['code']) &&
            ($data['result']['code'] == '000.000.000' ||
                $data['result']['code'] == '000.100.110')
        ) {
            if ($service != null) {
                if (session()->has('order_exist')) {
                    $order = \App\Order::where([
                        'user_id' => auth()->id(),
                        'service_id' => $service->id,
                        'status_id' => 1,
                    ])->find(session()->get('order_exist'));
                } else {
                    $order = \App\Order::where([
                        'user_id' => auth()->id(),
                        'service_id' => $service->id,
                        'status_id' => 1,
                    ])->first();
                    if (!$order) {
                        $order = \App\Order::create([
                            'user_id' => auth()->id(),
                            'service_id' => $service->id,
                            'status_id' => '2',
                            'content' => ' ',
                            'order_date' => now(),
                            'last_msg_date' => now(),
                            'is_canceled' => 0,
                        ]);
                    }
                }

                $payment = \App\Payment::create([
                    'user_id' => auth()->id(),
                    'order_id' => $order->id,
                    'service_id' => $service->id,
                    'bank_transaction_id' => $data['id'],
                    'amount' => $service->price,
                ]);
                $order->update([
                    'status_id' => '2',
                ]);
                if (session()->has('order')) {
                    session()->forget('order');
                }
                if (session()->has('order_exist')) {
                    session()->forget('order_exist');
                }
                $msg = 'Order Successfully';
                return redirect("admin/msgs/$order->id/edit");
            } else {
                $this->refund($this->entity_id($name), $service, $data['id']);
                $msg = 'Order Not Successfully';
                return view('admin.orders.index', compact(['msg']));
            }
        } else {
            $msg = 'Order Not Successfully';
            return view('admin.orders.index', compact(['msg']));
        }
        // echo "<pre>",print_r($data),"</pre>";
    }

    public function get_result2($name, $checkoutId)
    {
        $data = Http::withHeaders([
            'Authorization' => $this->configPayment['authorize_id'],
        ])
            ->get(
                $this->configPayment['checkoutUrlStatus'] .
                    "/$checkoutId/payment?entityId=" .
                    $this->entity_id($name)
            )
            ->json();
        $service = \App\Service::find(session()->get('order')['service_id']);
        if (
            isset($data['result']['code']) &&
            ($data['result']['code'] == '000.000.000' ||
                $data['result']['code'] == '000.100.110')
        ) {
            if ($service != null) {
                if (session()->has('order_exist')) {
                    $order = \App\Order::where([
                        'user_id' => auth()->id(),
                        'service_id' => $service->id,
                        'status_id' => 1,
                    ])->find(session()->get('order_exist'));
                } else {
                    $order = \App\Order::where([
                        'user_id' => auth()->id(),
                        'service_id' => $service->id,
                        'status_id' => 1,
                    ])->first();
                    if (!$order) {
                        $order = \App\Order::create([
                            'user_id' => auth()->id(),
                            'service_id' => $service->id,
                            'status_id' => '2',
                            'content' => ' ',
                            'order_date' => now(),
                            'last_msg_date' => now(),
                            'is_canceled' => 0,
                        ]);
                    }
                }

                $payment = \App\Payment::create([
                    'user_id' => auth()->id(),
                    'order_id' => $order->id,
                    'service_id' => $service->id,
                    'bank_transaction_id' => $data['id'],
                    'amount' => $service->price,
                ]);
                $order->update([
                    'status_id' => '2',
                ]);
                if (session()->has('order')) {
                    session()->forget('order');
                }
                if (session()->has('order_exist')) {
                    session()->forget('order_exist');
                }
                $msg = 'Order Successfully';
                // return redirect("admin/msgs/$order->id/edit");
            } else {
                $this->refund($this->entity_id($name), $service, $data['id']);
                $msg = 'Order Fail';
                // return view('admin.orders.index', compact(['msg']));
            }
        } else {
            $msg = 'Order Fail Code ' . $name;
        }
        // echo "<pre>",print_r($data),"</pre>";
        return $msg;
    }

    public function endOrder($id)
    {
        $order = \App\Order::where('status_id', 2)->findOrFail($id);
        $order->update([
            'status_id' => '3',
        ]);
        return back()->with('msg', 'تم تسليم الطلب بنجاح');
    }

    public function refund($entityId, $service, $checkoutId)
    {
        try {
            $price = $service->price;
            $data = Http::withHeaders([
                'Authorization' => $this->configPayment['authorize_id'],
            ])
                ->post(
                    $this->configPayment['checkoutUrlRefund'] .
                        "/$checkoutId?entityId=$entityId&amount=$price&currency=" .
                        $this->configPayment['currency'] .
                        '&paymentType=' .
                        $this->configPayment['paymentTypeCheckoutRefund']
                )
                ->json();
        } catch (\Exception $e) {
            dd($e);
        }
    }
}
