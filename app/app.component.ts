import { Component } from "@angular/core";
import {BarcodeScanner} from "nativescript-barcodescanner";
import {requestCoarseLocationPermission, startScanning, stopScanning, connect, disconnect, Peripheral} from "nativescript-bluetooth"

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {
    public array:Array<Peripheral>=[];
    public isItemVisible:boolean=false;
    public islistItemVisible:boolean=false;
    public listitems = ["QR_CODE",
                        "CODE_39",
                        "CODE_93",
                        "CODE_128",
                        "EAN_8",
                        "EAN_13",
                        "UPC_E"];
    public selectedindex=0;

    public selectType(){
        this.islistItemVisible=!this.islistItemVisible;
    }
    public onTap() {
        console.log(this.listitems[this.selectedindex]);
         let barcodescanner:BarcodeScanner =<BarcodeScanner> new BarcodeScanner();
        var options = {
            formats: this.listitems[this.selectedindex],
            cancelLabel: "EXIT. Also, try the volume buttons!",
            message: "Use the volume buttons for extra light",
            showFlipCameraButton: true,
            openSettingsIfPermissionWasPreviouslyDenied: true
        }
        barcodescanner.scan(options).then((result) => {
            // Note that this Promise is never invoked when a 'continuousScanCallback' function is provided
            alert({
                title: "Scan result",
                message: "Format: " + result.format + ",\nValue: " + result.text,
                okButtonText: "OK"
            });
            }, (errorMessage) => {
            console.log("No scan. " + errorMessage);
            }
        );
    }

    public requestCoarseLocationPermissionTap(){
        requestCoarseLocationPermission().then(
            function() {
                console.log("Location permission requested");
            }
        );
    }

    public startScanningTap(){
        var that =this;
        startScanning({
            serviceUUIDs: [],
            seconds: 4,
            onDiscovered: function (peripheral) {
                console.log("Periperhal found with UUID: " + peripheral.UUID);
                that.array=[];
                that.array.push(peripheral);
                if(that.array.length>0){
                    that.isItemVisible=true;
                }
            }
        }).then(function() {
            console.log("scanning complete");
            alert("scanning complete");
        }, function (err) {
            console.log("error while scanning: " + err);
            alert("error while scanning: " + err);
        });
    }


    public stopScanningTap(){
        this.isItemVisible=false;
        stopScanning().then(function() {
            console.log("scanning stopped");
            alert("scanning stopped");

            
        });
    }

    public connectTap(){
        var that =this;
        console.log(that.array[0].UUID);

        connect({
            UUID: that.array[0].UUID,
            onConnected: function (peripheral) {
                console.log("Periperhal connected with UUID: " + peripheral.UUID);

                // the peripheral object now has a list of available services:
                peripheral.services.forEach(function(service) {
                console.log("service found: " + JSON.stringify(service));
            });
            },
            onDisconnected: function (peripheral) {
                console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
            }
        });
    }

    public disconnectTap(){
        var that =this;
        disconnect({
            UUID: that.array[0].UUID
        }).then(function() {
            console.log("disconnected successfully");
            alert("disconnected successfully");
        }).then(function(err) {
            // in this case you're probably best off treating this as a disconnected peripheral though
            console.log("disconnection error: " + err);
            alert("disconnection error: " + err);
        });
    }
    
}
