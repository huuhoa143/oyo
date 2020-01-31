const axios = require('axios')
const prompt = require('prompt');
const uuidv4 = require('uuid/v4');
const uniqueRandom = require('unique-random');
const ramdomUserAgen = Math.floor(Math.random() * Math.floor(3))
const randomLorem   = require('random-lorem');

const names = [
    'Chu Thị Xuân', 'Nguyễn Thị Hồng', 'Phạm Thị Diệp', 'Ngọc Bích Trinh', 'Châu Thị Nghè', 'Phạm Ngọc Hùng', 'Chung Văn Bảy', 'Phạm Ngọc Huyền', 'Liên Thị Lý', 'Nguyễn Thị Ngọc', 'Bùi Kim Quyên', 'Võ An Phước Thiện', 'Dương Hoài Phương', 'Phan Vinh Bính', 'Võ Minh Thư', 'Phan Huỳnh Ngọc Dung', 'Nguyễn Vân Anh', 'Nguyễn Thế Vinh', 'Nguyen Thi Thanh Bích', 'Lê Minh Vương', 'Trương Gia Mẫn', 'Vương Thu Hiền', 'Châu Thị Kim Anh', 'Trần NGọc Trang', 'Cao Minh Hiền', 'Ta thị thanh tuyen', 'Võ Thị Tuyết Vân', 'Mai Khánh Vân', 'Đoàn Thị Mỹ Xuân', 'Doãn Phan Trung Hải', 'Lâm Ngọc Linh', 'Nguyễn Minh Châu'
]

const random = uniqueRandom(1, names.length);

const randomName = names[random()]


function appInit(mobile) {

    const deviceID = uuidv4().toUpperCase()
    let url = `https://bff.oyorooms.com/v1/app_init?additional_fields=ab_service_data&device_id=${deviceID}&on_boarding_flow=1&version=6.4&wizard_renewal_support=1`;

    // let mobileRemove0 = mobile.split('0')[1];

    // console.log("Phone: ", mobileRemove0);

    const userAgent = `oyo-ios/6.4 (iPhone; iOS 1${ramdomUserAgen}.2; Scale/2.00)`
    let headers = {
        "SEGMENT_CONFIG": "default",
        "User-Agent": userAgent,
        "Accept-Language": "vi_TW",
        "access_token": "Q0s3RGV2M3hZcFp6QjRib2lIUmE6a1lWNjVGZXRrcWdOM0d6S3V5aEc=",
    }

    return axios.get(url, {
        headers: headers,
    }).then(async (res) => {
        // if (res.status === 200) {
        //     console.log("Cập nhật ref thành công tới số điện thoại: ", mobile), "/n";
        //     let headers = res.headers['set-cookie'];
        //     let cookie = headers[0];
        //     let __cfduid = cookie.split(";")[0];
        //     console.log(__cfduid)
        //     await setDeviceID(mobile, __cfduid, randomAgent)
        // } else {
        //     console.log("Lỗi cập nhật ref")
        // }
        const oyoConfig = res.data.ab_service_data.config
        await sendVerifyCode(mobile, oyoConfig, userAgent, deviceID)
    }).catch((err) => {
        console.log("Error: ", err);
    })
}

function sendVerifyCode(mobile, oyoConfig, userAgent, deviceID) {
    const idfa = uuidv4().toUpperCase()
    let url = `https://api.oyorooms.com/v2/users/generate_otp?country_code=%2B84&country_iso_code=VN&idfa=${idfa}&intent=login&lat=0&lon=0&nod=4&phone=${mobile}&version=6.4`;

    // let mobileRemove0 = mobile.split('0')[1];

    // console.log("Phone: ", mobileRemove0);

    let headers = {
        "SEGMENT_CONFIG": "default",
        "OYO_AB_CONFIG": oyoConfig,
        "User-Agent": userAgent,
        "access_token": "Q0s3RGV2M3hZcFp6QjRib2lIUmE6a1lWNjVGZXRrcWdOM0d6S3V5aEc=",
        "Accept-Language": "vi",
    }

    return axios.get(url, {
        headers: headers,
    }).then(async (res) => {
        // if (res.status === 200) {
        //     console.log("Cập nhật ref thành công tới số điện thoại: ", mobile), "/n";
        //     let headers = res.headers['set-cookie'];
        //     let cookie = headers[0];
        //     let __cfduid = cookie.split(";")[0];
        //     console.log(__cfduid)
        //     await setDeviceID(mobile, __cfduid, randomAgent)
        // } else {
        //     console.log("Lỗi cập nhật ref")
        // }

        if (res.data.is_user_present === false) {
            console.log("Gửi mã xác nhận thành công")
            prompt.get(['verifyCode'], async (err, result) => {
                await verifyCode(mobile, oyoConfig, userAgent, result.verifyCode, deviceID, idfa)
            });
        }

    }).catch((err) => {
        console.log("Error: ", err);
    })
}

function verifyCode(mobile, oyoConfig, userAgent, verifyCode, deviceID, idfa) {
    let url = 'https://api.oyorooms.com/v2/users/check_otp';

    let headers = {
        "Content-Type": "application/json",
        "SEGMENT_CONFIG": "default",
        "OYO_AB_CONFIG": oyoConfig,
        "User-Agent": userAgent,
        "access_token": "Q0s3RGV2M3hZcFp6QjRib2lIUmE6a1lWNjVGZXRrcWdOM0d6S3V5aEc=",
        "Accept-Language": "vi",
    }

    let payload = {
        country_iso_code: "VN",
        country_code: "+84",
        code: verifyCode,
        phone: mobile,
    }

    return axios.post(url, payload, {
        headers: headers,
    }).then(async (res) => {

        const otpAuthToken = res.data.otp_auth_token
        prompt.get(['referralcode'], async (err, result) => {
            await addReferral(mobile, oyoConfig, userAgent, result.referralcode, deviceID, idfa, otpAuthToken)
        });
    }).catch((err) => {
        console.log("Error: ", err);
    })
}

function addReferral(mobile, oyoConfig, userAgent, referralCode, deviceID, idfa, otpAuthToken) {
    let url = 'https://api.oyorooms.com/referral/validate_code';

    let headers = {
        "OYO_AB_CONFIG": oyoConfig,
        "Accept-Language": "vi",
        "Content-Type": "application/json",
        "SEGMENT_CONFIG": "default",
        "User-Agent": userAgent,
        "Cookie": "request_method=POST",
        "access_token": "Q0s3RGV2M3hZcFp6QjRib2lIUmE6a1lWNjVGZXRrcWdOM0d6S3V5aEc="
    }

    let payload = {
        code: referralCode,
    }

    return axios.post(url, payload, {
        headers: headers,
    }).then(async (res) => {

        console.log("Res: ", res.data)
        await newUser(mobile, oyoConfig, userAgent, referralCode, deviceID, idfa, otpAuthToken)
    }).catch((err) => {
        console.log("Error: ", err);
    })
}

function newUser(mobile, oyoConfig, userAgent, referralCode, deviceID, idfa, otpAuth) {
    let url = 'https://api.oyorooms.com/v2/users/new_sign_up';

    let headers = {
        "OYO_AB_CONFIG": oyoConfig,
        "Accept-Language": "vi",
        "Content-Type": "application/json",
        "SEGMENT_CONFIG": "default",
        "User-Agent": userAgent,
        "Cookie": "request_method=POST",
        "access_token": "Q0s3RGV2M3hZcFp6QjRib2lIUmE6a1lWNjVGZXRrcWdOM0d6S3V5aEc="
    }

    let payload = {
        referal_code: referralCode,
        truecaller: false,
        additional_fields: "ab_service_data",
        phone: mobile,
        lon: 0,
        idfa: idfa,
        version: 6.4,
        country_iso_code: "VN",
        device_type: "iOS",
        otp_auth_token: otpAuth,
        lat: 0,
        device_id: deviceID,
        os_version: `1${ramdomUserAgen}.2`,
        email: randomLorem({ syllables: 5 }) + '@gmail.com',
        country_code: "+84",
        name: randomName,
    }

    return axios.post(url, payload, {
        headers: headers,
    }).then(async (res) => {

        console.log("Thành công ref: ", randomName)
    }).catch((err) => {
        console.log("Error: ", err);
    })
}

function sendPhoneNumber(mobile, orderID) {
    let url = 'https://vn.goswak.com/gwapi/order/zero/submit/phone';

    // let deviceID = uuidv4()
    let randomFourNumber = Math.floor(1000 + Math.random() * (9999-1000 + 1))
    let deviceID = `16f9f75d5a421b-005${randomFourNumber}1aef0138-481c3301-12${randomFourNumber}0-16f9f75d5a5ac1`
    let cookie = `_gat_gtag_UA_677${randomFourNumber}3_30=1; _ga=GA1.2.170${randomFourNumber}038.1578${randomFourNumber}96; _gid=GA1.2.713750847.1579105271; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22${deviceID}%22%2C%22%24device_id%22%3A%22${deviceID}%22%2C%22props%22%3A%7B%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%7D%7D; webp=false; acw_tc=0bc1a1861579${randomFourNumber}688554787e57d6f8a868c19d9${randomFourNumber}1904aace62b9e05ac; isFirstLoad=true`
    let headers = {
        "deviceType": "iOS",
        "deviceMode": "iPhone 6",
        "appVersion": "1.2.2",
        "countryId": "VN",
        "Accept-Language": "vi-vn",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "Origin": "https://vn.goswak.com",
        "deviceId": uuidv4(),
        "User-Agent": "Mozilla/3.0 (Macintosh; Intel Mac OS X 10_11_1)",
        "Referer": `Referer: https://vn.goswak.com/share/join-free-buy?groupOrderId=${orderID}`,
        "languageId": "vi",
        "Cookie": cookie,
    }

    let payload = `groupOrderId=${orderID}&phoneNumber=${mobile}`

    return axios.post(url, payload, {
        headers: headers,
    }).then(async (res) => {

        const response = res.data.data.rightHelp

        if (response === 2) {
            console.log("Số điện thoại này đã giúp bạn bè vui lòng chọn số khác")
        } else {
            console.log(`Nhận quà thành công cho số điện thoại: ${mobile}`)
        }

        await sendVerifyCode(mobile)

    }).catch((err) => {
        console.log("Error: ", err);
    })
}

prompt.start();

prompt.get(['mobile'], async (err, result) => {

    try {
        await appInit(result.mobile);
    } catch (e) {
        throw e
    }
});
