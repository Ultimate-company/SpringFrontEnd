package org.example.springfrontend.Controllers;

import org.example.ApiRoutes;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiRoutes.ApiControllerNames.BULK)
public class BulkController extends BaseController {
}
