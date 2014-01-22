
//
//  VideoPlugin.m
//  YY
//
//  Created by wonliao on 13/6/7.
//
//

#import "VideoPlugin.h"

@implementation VideoPlugin

@synthesize captureSession, imageView, customLayer, prevLayer, mostColor;


- (void)echo:(CDVInvokedUrlCommand*)command
{
    NSLog(@"echo method");

    // 回傳的參數
    CDVPluginResult* pluginResult = nil;

    // 收到的參數
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {

        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {

        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)echoThreading:(CDVInvokedUrlCommand*)command
{
    NSLog(@"echoThreading method");

    // Check command.arguments here.
    [self.commandDelegate runInBackground:^{

        // 回傳的參數
        NSString* payload = nil;

        // 收到的參數
        NSString* argument = @"1";//[command.arguments objectAtIndex:0];

        payload = argument;

        // Some blocking logic...
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payload];

        // The sendPluginResult method is thread-safe.
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)startVideo:(CDVInvokedUrlCommand*)command
{
    NSLog(@"startVideo method");

    [self setupCapture];

    // Check command.arguments here.
    [self.commandDelegate runInBackground:^{

        // 回傳的參數
        NSString* payload = @"startVideo OK";

        // 收到的參數
        //NSString* argument = [command.arguments objectAtIndex:0];

        // Some blocking logic...
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payload];

        // The sendPluginResult method is thread-safe.
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)stopVideo:(CDVInvokedUrlCommand*)command
{
    NSLog(@"stopVideo method");

    [self stopCapture];

    // Check command.arguments here.
    [self.commandDelegate runInBackground:^{
        
        // 回傳的參數
        NSString* payload = @"stopVideo OK";

        // 收到的參數
        //NSString* argument = [command.arguments objectAtIndex:0];

        // Some blocking logic...
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payload];

        // The sendPluginResult method is thread-safe.
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)getVideoImage:(CDVInvokedUrlCommand*)command
{
    //NSLog(@"getVideoImage method");

    // Check command.arguments here.
    [self.commandDelegate runInBackground:^{

        // 回傳的參數
        //NSString* payload = [NSString stringWithFormat:@"%@", m_imageStr];
        
        const size_t totalComponents = CGColorGetNumberOfComponents(m_mostColor.CGColor);
        NSString* luma = @"";
        if(totalComponents > 0) {
            const CGFloat * components = CGColorGetComponents(m_mostColor.CGColor);
            int r = (int)(components[0] * 255);
            int g = (int)(components[1] * 255);
            int b = (int)(components[2] * 255);
            //int alpha = (int)(components[3] * 255);
            
            // RGBからYUVを求める
            CGFloat Y = 0.299*r + 0.587*g + 0.114*b;
            //CGFloat U = -0.169*r - 0.331*g + 0.5*b;
            //CGFloat V = 0.5*r - 0.419*g - 0.081*b;

            luma = [NSString stringWithFormat:@"%f", Y];
        }
        NSString* payload = [NSString stringWithFormat:@"%@", luma];

        // 收到的參數
        //NSString* argument = [command.arguments objectAtIndex:0];

        // Some blocking logic...
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payload];

        // The sendPluginResult method is thread-safe.
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)setVideoImage:(CDVInvokedUrlCommand*)command
{
    //NSLog(@"getVideoImage method");

    // 收到的參數
    NSString* argument = [command.arguments objectAtIndex:0];

    if( self.imageView == Nil ) {

        self.imageView = [[UIImageView alloc] init];
        self.imageView.frame = CGRectMake(0, 0, 320, 320);
        self.imageView.tag = 100;
        [self.webView addSubview:self.imageView];
    } 

    // 還原圖片
    NSData *imageData = [NSData dataFromBase64String:argument];
    UIImage *image = [UIImage imageWithData:imageData];
    [self.imageView setImage:image];
}

- (void)setupCapture
{
	AVCaptureDeviceInput *captureInput = [AVCaptureDeviceInput
										  deviceInputWithDevice:[AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo]
										  error:nil];

	AVCaptureVideoDataOutput *captureOutput = [[AVCaptureVideoDataOutput alloc] init];

	captureOutput.alwaysDiscardsLateVideoFrames = YES;

	dispatch_queue_t queue;
	queue = dispatch_queue_create("cameraQueue", NULL);
	[captureOutput setSampleBufferDelegate:self queue:queue];
	dispatch_release(queue);
	NSDictionary* videoSettings = @{(__bridge NSString*)kCVPixelBufferPixelFormatTypeKey: [NSNumber numberWithUnsignedInt:kCVPixelFormatType_32BGRA]};
	[captureOutput setVideoSettings:videoSettings];

	self.captureSession = [[AVCaptureSession alloc] init];
	[self.captureSession addInput:captureInput];
	[self.captureSession addOutput:captureOutput];
    [self.captureSession setSessionPreset:AVCaptureSessionPresetLow];

	//We add the imageView
    self.imageView = [[UIImageView alloc] init];
	self.imageView.frame = CGRectMake(0, 0, 320, 320);
    self.imageView.tag = 100;
    [self.webView addSubview:self.imageView];

    // 打開閃光燈
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    [self.captureSession beginConfiguration];
    [device lockForConfiguration:nil];
    [device setTorchMode:AVCaptureTorchModeOn];
    [device unlockForConfiguration];
    [self.captureSession commitConfiguration];

    
	[self.captureSession startRunning];
}

- (void)stopCapture {

    [self.captureSession stopRunning];

    UIView *removeView;
    while((removeView = [self.webView viewWithTag:100]) != nil) {
        [removeView removeFromSuperview];
    }
}

#pragma mark -
#pragma mark AVCaptureSession delegate
- (void)captureOutput:(AVCaptureOutput *)captureOutput
didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer
	   fromConnection:(AVCaptureConnection *)connection
{
	@autoreleasepool {

        CVImageBufferRef imageBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
        CVPixelBufferLockBaseAddress(imageBuffer,0);

        uint8_t *baseAddress = (uint8_t *)CVPixelBufferGetBaseAddress(imageBuffer);
        size_t bytesPerRow = CVPixelBufferGetBytesPerRow(imageBuffer);
        size_t width = CVPixelBufferGetWidth(imageBuffer);
        size_t height = CVPixelBufferGetHeight(imageBuffer);

        CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
        CGContextRef newContext = CGBitmapContextCreate(baseAddress, width, height, 8, bytesPerRow, colorSpace, kCGBitmapByteOrder32Little | kCGImageAlphaPremultipliedFirst);
        CGImageRef newImage = CGBitmapContextCreateImage(newContext);

        CGContextRelease(newContext);
        CGColorSpaceRelease(colorSpace);

        dispatch_sync(dispatch_get_main_queue(), ^{
            [self.customLayer setContents:(__bridge id)newImage];
        });

        UIImage *image= [UIImage imageWithCGImage:newImage scale:0.5 orientation:UIImageOrientationRight];

        CGImageRelease(newImage);

        dispatch_sync(dispatch_get_main_queue(), ^{

  
            NSData *data = UIImageJPEGRepresentation(image, 0.5);   // 圖片壓縮比
            //m_imageStr = [NSString stringWithFormat:@"%@", [data base64EncodedString]];

            m_img = [UIImage imageWithData:data];
            self.mostColor = [m_img mostColor];
            
            [self.imageView setImage:image];
        });

        m_mostColor = mostColor;
        
        CVPixelBufferUnlockBaseAddress(imageBuffer,0);
    }
}
@end



