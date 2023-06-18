<?php

declare(strict_types=1);

namespace Sitegeist\InspectorGadget\Tests\Infrastructure\ContentRepository;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\Flow\Tests\UnitTestCase;
use Sitegeist\InspectorGadget\Infrastructure\ContentRepository\PropertyTypeForwarder;

final class PropertyTypeForwarderTest extends UnitTestCase
{
    /**
     * @test
     */
    public function forwardsPropertyTypesForPropertiesWithInspectorGadgetEditor(): void
    {
        $rawNodeTypeConfiguration = [
            'properties' => [
                'foo' => [
                    'type' => 'Vendor\\Site\\Domain\\Foo',
                    'ui' => [
                        'inspector' => [
                            'editor' => 'Sitegeist.InspectorGadget/Inspector/Editor'
                        ]
                    ]
                ],
                'bar' => [
                    'type' => 'Vendor\\Site\\Domain\\Bar',
                    'ui' => []
                ],
                'baz' => [
                    'type' => 'Vendor\\Site\\Domain\\Baz',
                    'ui' => [
                        'inspector' => [
                            'editor' => 'Some.Other/Editor'
                        ]
                    ]
                ]
            ]
        ];

        $expectedNodeTypeConfiguration = [
            'properties' => [
                'foo' => [
                    'type' => 'Vendor\\Site\\Domain\\Foo',
                    'ui' => [
                        'inspector' => [
                            'editor' => 'Sitegeist.InspectorGadget/Inspector/Editor',
                            'editorOptions' => [
                                'type' => 'Vendor\\Site\\Domain\\Foo'
                            ]
                        ]
                    ]
                ],
                'bar' => [
                    'type' => 'Vendor\\Site\\Domain\\Bar',
                    'ui' => []
                ],
                'baz' => [
                    'type' => 'Vendor\\Site\\Domain\\Baz',
                    'ui' => [
                        'inspector' => [
                            'editor' => 'Some.Other/Editor'
                        ]
                    ]
                ]
            ]
        ];

        $nodeType = $this->createMock(NodeType::class);
        $propertyForwarder = new PropertyTypeForwarder();

        $propertyForwarder->process($nodeType, $rawNodeTypeConfiguration, []);

        $this->assertEquals($expectedNodeTypeConfiguration, $rawNodeTypeConfiguration);
    }

    /**
     * @test
     */
    public function worksWithNodeTypesThatHaveNoProperties(): void
    {
        $rawNodeTypeConfiguration = [];

        $nodeType = $this->createMock(NodeType::class);
        $propertyForwarder = new PropertyTypeForwarder();
        $propertyForwarder->process($nodeType, $rawNodeTypeConfiguration, []);

        $this->assertEquals($rawNodeTypeConfiguration, $rawNodeTypeConfiguration);
    }
}
